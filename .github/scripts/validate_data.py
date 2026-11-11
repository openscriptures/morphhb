#!/usr/bin/env python3
"""Validate the OSHB data files and summarise what a change touches.

Usage: validate_data.py [--root DIR] [--base DIR]

Checks (any failure exits 1):
  * every tracked .xml file is well-formed
  * wlc/: 39 books, the expected verse inventory, every <w> is inside a
    verse and carries a lemma, a morph code and a unique five-character id
  * MAPM/MAPM.xml: present, verse milestones are balanced, and its verse
    inventory matches wlc/ (apart from the verses MAM's text does not have)
  * no operating-system junk files are tracked

With --base (a checkout of the revision being merged into) it also writes a
summary of which words and verses changed, to stdout and, on GitHub Actions,
to the job summary. The summary never fails the build: problems in the base
revision, or in producing the summary, are reported in the summary only.

Standard library only.
"""
import argparse
import collections
import os
import re
import subprocess
import sys
import unicodedata
import xml.etree.ElementTree as ET

NS = "{http://www.bibletechnologies.net/2003/OSIS/namespace}"
WLC_BOOKS = 39
WLC_VERSES = 23213
# Verses that BHS numbers but MAM's text does not have.
MAPM_ABSENT = {"Josh.21.36", "Josh.21.37"}
JUNK = re.compile(r"(^|/)(Thumbs\.db|\.DS_Store|desktop\.ini)$", re.I)
# These are applied with fullmatch(): "$" alone would accept a trailing newline.
MORPH = re.compile(r"[HA][A-Za-z0-9]+(/[A-Za-z0-9]+)*")
STRUCT = re.compile(r"\d+(\.\d+)*")
WORD_ID = re.compile(r"[0-9]{2}[A-Za-z0-9]{3}")
VERSE_ID = re.compile(r"[1-2]?[A-Za-z]+\.\d+\.\d+")
WORD_FIELDS = ("text", "lemma", "morph", "n", "type", "verse")
MAX_ROWS = 200

errors = []
parsed = set()  # absolute paths already checked for well-formedness


def error(msg):
    errors.append(msg)


def tracked_files(root):
    try:
        out = subprocess.run(["git", "-C", root, "ls-files", "-z"], check=True,
                             capture_output=True).stdout.decode("utf-8")
        return [f for f in out.split("\0") if f]
    except (OSError, subprocess.CalledProcessError):
        found = []
        for base, dirs, files in os.walk(root):
            dirs[:] = [d for d in dirs if d != ".git"]
            found += [os.path.relpath(os.path.join(base, f), root) for f in files]
        return found


def parse(path, label=None, quiet=False):
    """Parse an XML file. Returns its root, or None if it cannot be parsed.

    A failure is a validation error unless quiet is set, which is how the
    base revision is read: its problems must not fail the current one.
    """
    if not quiet:
        parsed.add(os.path.abspath(path))
    try:
        return ET.parse(path).getroot()
    except ET.ParseError as exc:
        if not quiet:
            error(f"{label or path}: not well-formed XML: {exc}")
    except OSError as exc:
        if not quiet:
            error(f"{label or path}: cannot read: {exc}")
    return None


def tag(el):
    return el.tag.replace(NS, "")


# ---------------------------------------------------------------- wlc/

Wlc = collections.namedtuple("Wlc", "words verses order unreadable")


def load_wlc(root, check):
    """Read the wlc/ books under root.

    words: {word id: record}; verses: [verse ids]; order: {verse id: [word
    ids]}; unreadable: book files that could not be parsed. With check set,
    problems are recorded as validation errors.
    """
    words, verses, order, unreadable = {}, [], {}, []
    wlc = os.path.join(root, "wlc")
    books = sorted(f for f in os.listdir(wlc)
                   if f.endswith(".xml") and f != "VerseMap.xml") if os.path.isdir(wlc) else []
    if check and len(books) != WLC_BOOKS:
        error(f"wlc/: expected {WLC_BOOKS} book files, found {len(books)}")
    for name in books:
        rel = f"wlc/{name}"
        doc = parse(os.path.join(wlc, name), label=rel, quiet=not check)
        if doc is None:
            unreadable.append(rel)
            continue
        book = name[:-4]
        in_verse = set()
        for verse in doc.iter(NS + "verse"):
            vid = verse.get("osisID", "")
            verses.append(vid)
            ids = order.setdefault(vid, [])
            if check and (not VERSE_ID.fullmatch(vid) or vid.split(".")[0] != book):
                error(f"{rel}: unexpected verse osisID {vid!r}")
            for w in verse.iter(NS + "w"):
                in_verse.add(w)
                wid = w.get("id")
                rec = {"verse": vid, "book": rel, "text": "".join(w.itertext()),
                       "lemma": w.get("lemma"), "morph": w.get("morph"),
                       "n": w.get("n"), "type": w.get("type")}
                if check:
                    where = f"{rel} {vid} word {wid!r}"
                    if wid is None or not WORD_ID.fullmatch(wid):
                        error(f"{where}: missing or malformed id")
                    elif wid in words:
                        error(f"{where}: duplicate id (also in {words[wid]['verse']})")
                    if not rec["lemma"]:
                        error(f"{where}: missing lemma")
                    if not rec["morph"] or not MORPH.fullmatch(rec["morph"]):
                        error(f"{where}: missing or malformed morph {rec['morph']!r}")
                    if rec["n"] is not None and not STRUCT.fullmatch(rec["n"]):
                        error(f"{where}: malformed n {rec['n']!r}")
                    if not rec["text"].strip():
                        error(f"{where}: empty word")
                if wid is not None:
                    ids.append(wid)
                    words.setdefault(wid, rec)
        if check:
            for w in doc.iter(NS + "w"):
                if w not in in_verse:
                    text = "".join(w.itertext()).strip()
                    error(f"{rel}: word outside any verse (id {w.get('id')!r}, text {text[:20]!r})")
    if check:
        if len(verses) != WLC_VERSES:
            error(f"wlc/: expected {WLC_VERSES} verses, found {len(verses)}")
        if len(set(verses)) != len(verses):
            dup = [v for v, c in collections.Counter(verses).items() if c > 1]
            error(f"wlc/: duplicate verse ids: {dup[:5]}")
    return Wlc(words, verses, order, unreadable)


# ---------------------------------------------------------------- MAPM/

def load_mapm(root, check):
    """Return {verse id: text} for MAPM/MAPM.xml, or None if absent or unparseable.

    With check set, problems (including the file being absent) are recorded
    as validation errors.
    """
    rel = "MAPM/MAPM.xml"
    path = os.path.join(root, "MAPM", "MAPM.xml")
    if not os.path.exists(path):
        if check:
            error(f"{rel}: file is missing")
        return None
    doc = parse(path, label=rel, quiet=not check)
    if doc is None:
        return None
    verses, current, skip = collections.OrderedDict(), None, 0

    def walk(el):
        nonlocal current, skip
        name = tag(el)
        if name == "verse":
            start, end = el.get("sID"), el.get("eID")
            if check and bool(start) == bool(end):
                which = "both sID and eID" if start else "neither sID nor eID"
                error(f"{rel}: verse milestone {start or el.get('osisID')!r} has {which}")
            if start:
                if check and current is not None:
                    error(f"{rel}: verse {start} starts before {current} ends")
                current = start
                if check and current in verses:
                    error(f"{rel}: duplicate verse {current}")
                verses[current] = []
            elif end:
                if check and end != current:
                    error(f"{rel}: verse end {end} does not match open verse {current}")
                current = None
        muted = name in ("note", "title", "header")
        skip += muted
        if el.text and not skip:
            text(el.text)
        for child in el:
            walk(child)
            if child.tail and not skip:
                text(child.tail)
        skip -= muted

    def text(s):
        if current is not None:
            verses[current].append(s)
        elif check and s.strip():
            error(f"{rel}: text outside any verse: {s.strip()[:30]!r}")

    walk(doc)
    if check and current is not None:
        error(f"{rel}: verse {current} is never closed")
    return {v: re.sub(r"\s+", " ", "".join(parts)).strip() for v, parts in verses.items()}


def letters(s):
    return "".join(c for c in s if "א" <= c <= "ת")


# ---------------------------------------------------------------- report

def clip(items, limit):
    return ", ".join(items[:limit]) + (" …" if len(items) > limit else "")


def report(base, wlc, mapm):
    """Markdown summary of what differs from the base revision.

    The base is read quietly: nothing here adds to the validation errors.
    """
    out = ["## Data change summary", "", "### wlc/"]
    old = load_wlc(base, check=False)
    skipped = set(old.unreadable)
    if skipped:
        out.append(f"- not compared, because the base revision's copy could not be read: "
                   f"{clip(sorted(skipped), 40)}")
    words = {i: r for i, r in wlc.words.items() if r["book"] not in skipped}
    added = [i for i in words if i not in old.words]
    removed = [i for i in old.words if i not in wlc.words]
    changed = []
    for wid, rec in words.items():
        before = old.words.get(wid)
        if before is None:
            continue
        fields = [f for f in WORD_FIELDS if rec[f] != before[f]]
        if fields:
            changed.append((wid, rec, before, fields))
    reordered = [v for v, ids in wlc.order.items()
                 if v in old.order and ids != old.order[v] and sorted(ids) == sorted(old.order[v])]
    if not (added or removed or changed or reordered):
        out.append("No word-level changes." if not skipped else "No word-level changes in the books compared.")
    else:
        per_field = collections.Counter(f for _, _, _, fs in changed for f in fs)
        out.append(f"- words changed: **{len(changed)}** "
                   f"({', '.join(f'{f}: {n}' for f, n in per_field.most_common()) or 'none'})")
        out.append(f"- word ids added: **{len(added)}**, removed: **{len(removed)}**")
        out.append(f"- verses whose words are the same but in a different order: **{len(reordered)}**"
                   + (f" — {clip(reordered, 60)}" if reordered else ""))
        if changed:
            out += ["", "| verse | id | field | before | after |", "|---|---|---|---|---|"]
            rows = [(rec["verse"], wid, f, before[f], rec[f])
                    for wid, rec, before, fs in changed for f in fs]
            for v, wid, f, a, b in rows[:MAX_ROWS]:
                out.append(f"| {v} | `{wid}` | {f} | {a if a is not None else '(none)'} "
                           f"| {b if b is not None else '(none)'} |")
            if len(rows) > MAX_ROWS:
                out.append(f"| … | | | {len(rows) - MAX_ROWS} more rows not shown | |")
            out.append("")
        for label, ids, src in (("added", added, words), ("removed", removed, old.words)):
            if ids:
                shown = clip(["`%s` (%s)" % (i, src[i]["verse"]) for i in ids], 30)
                out.append(f"- {label}: {shown}")
    out += ["", "### MAPM/"]
    old_mapm = load_mapm(base, check=False)
    if mapm is None or old_mapm is None:
        out.append("MAPM/MAPM.xml is missing or unreadable on one side; not compared.")
    elif mapm == old_mapm:
        out.append("No verse text changes.")
    else:
        shared = [v for v in mapm if v in old_mapm]
        differ = [v for v in shared if mapm[v] != old_mapm[v]]
        marks_only = [v for v in differ
                      if unicodedata.normalize("NFD", mapm[v]).replace(" ", "")
                      == unicodedata.normalize("NFD", old_mapm[v]).replace(" ", "")]
        cons = [v for v in differ if letters(mapm[v]) != letters(old_mapm[v])]
        out.append(f"- verses only in this revision: **{len(set(mapm) - set(old_mapm))}**, "
                   f"only in base: **{len(set(old_mapm) - set(mapm))}**")
        out.append(f"- shared verses whose text differs: **{len(differ)}** of {len(shared)} "
                   f"({len(marks_only)} differ only in spacing or mark order)")
        out.append(f"- of those, verses whose consonants differ: **{len(cons)}**"
                   + (f" — {clip(cons, 60)}" if cons else ""))
    return "\n".join(out) + "\n"


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--root", default=".")
    ap.add_argument("--base", help="checkout of the base revision, for the change summary")
    args = ap.parse_args()
    root = args.root

    files = tracked_files(root)
    for f in files:
        if JUNK.search(f):
            error(f"{f}: operating-system junk file is tracked; please remove it")

    wlc = load_wlc(root, check=True)
    mapm = load_mapm(root, check=True)
    if mapm is not None and wlc.verses:
        expected = set(wlc.verses) - MAPM_ABSENT
        got = set(mapm)
        if got != expected:
            extra, missing = sorted(got - expected), sorted(expected - got)
            error(f"MAPM/MAPM.xml: verse inventory differs from wlc/ "
                  f"(unexpected: {extra[:8]}{' …' if len(extra) > 8 else ''}; "
                  f"missing: {missing[:8]}{' …' if len(missing) > 8 else ''})")

    # Every other tracked XML file, whatever it is, must at least be well-formed.
    for f in files:
        path = os.path.join(root, f)
        if f.lower().endswith(".xml") and os.path.abspath(path) not in parsed:
            if os.path.exists(path):
                parse(path, label=f)

    print(f"wlc/: {len(wlc.verses)} verses, {len(wlc.words)} words")
    if mapm is not None:
        print(f"MAPM/: {len(mapm)} verses")

    if args.base:
        try:
            summary = report(args.base, wlc, mapm)
        except Exception as exc:  # the summary is a convenience and must never fail the run
            summary = f"## Data change summary\n\nThe summary could not be produced: {exc!r}\n"
        print("\n" + summary)
        target = os.environ.get("GITHUB_STEP_SUMMARY")
        if target:
            with open(target, "a", encoding="utf-8") as fh:
                fh.write(summary)

    if errors:
        print(f"\nFAILED: {len(errors)} problem(s)")
        for e in errors[:100]:
            print(f"  - {e}")
            if os.environ.get("GITHUB_ACTIONS"):
                print(f"::error::{e}")
        if len(errors) > 100:
            print(f"  … and {len(errors) - 100} more")
        return 1
    print("\nOK: all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
