#!/usr/bin/env python3
"""Validate the OSHB data files and summarise what a change touches.

Usage: validate_data.py [--root DIR] [--base DIR]

Checks (any failure exits 1):
  * every tracked .xml file is well-formed
  * wlc/: 39 books, the expected verse inventory, and every <w> carries a
    lemma, a morph code and a unique five-character id
  * MAPM/MAPM.xml: verse milestones are balanced and its verse inventory
    matches wlc/ (apart from the verses MAM's text does not have)
  * no operating-system junk files are tracked

With --base (a checkout of the revision being merged into) it also writes a
summary of which words and verses changed, to stdout and, on GitHub Actions,
to the job summary. The summary never fails the build; it is there to make
review easier.

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
MORPH = re.compile(r"^[HA][A-Za-z0-9]+(/[A-Za-z0-9]+)*$")
STRUCT = re.compile(r"^\d+(\.\d+)*$")
WORD_ID = re.compile(r"^[0-9]{2}[A-Za-z0-9]{3}$")
VERSE_ID = re.compile(r"^[1-2]?[A-Za-z]+\.\d+\.\d+$")
MAX_ROWS = 200

errors = []


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


def parse(path):
    try:
        return ET.parse(path).getroot()
    except ET.ParseError as exc:
        error(f"{path}: not well-formed XML: {exc}")
    except OSError as exc:
        error(f"{path}: cannot read: {exc}")
    return None


def tag(el):
    return el.tag.replace(NS, "")


# ---------------------------------------------------------------- wlc/

def load_wlc(root, check):
    """Return ({word id: record}, [verse ids]) for the wlc/ books under root."""
    words, verses = {}, []
    wlc = os.path.join(root, "wlc")
    books = sorted(f for f in os.listdir(wlc)
                   if f.endswith(".xml") and f != "VerseMap.xml") if os.path.isdir(wlc) else []
    if check and len(books) != WLC_BOOKS:
        error(f"wlc/: expected {WLC_BOOKS} book files, found {len(books)}")
    for name in books:
        rel = f"wlc/{name}"
        doc = parse(os.path.join(wlc, name))
        if doc is None:
            continue
        book = name[:-4]
        for verse in doc.iter(NS + "verse"):
            vid = verse.get("osisID", "")
            verses.append(vid)
            if check and (not VERSE_ID.match(vid) or vid.split(".")[0] != book):
                error(f"{rel}: unexpected verse osisID {vid!r}")
            for w in verse.iter(NS + "w"):
                wid = w.get("id")
                rec = {"verse": vid, "text": "".join(w.itertext()),
                       "lemma": w.get("lemma"), "morph": w.get("morph"),
                       "n": w.get("n"), "type": w.get("type")}
                if check:
                    where = f"{rel} {vid} word {wid!r}"
                    if wid is None or not WORD_ID.match(wid):
                        error(f"{where}: missing or malformed id")
                    elif wid in words:
                        error(f"{where}: duplicate id (also in {words[wid]['verse']})")
                    if not rec["lemma"]:
                        error(f"{where}: missing lemma")
                    if not rec["morph"] or not MORPH.match(rec["morph"]):
                        error(f"{where}: missing or malformed morph {rec['morph']!r}")
                    if rec["n"] is not None and not STRUCT.match(rec["n"]):
                        error(f"{where}: malformed n {rec['n']!r}")
                    if not rec["text"].strip():
                        error(f"{where}: empty word")
                if wid is not None:
                    words.setdefault(wid, rec)
    if check:
        if len(verses) != WLC_VERSES:
            error(f"wlc/: expected {WLC_VERSES} verses, found {len(verses)}")
        if len(set(verses)) != len(verses):
            dup = [v for v, c in collections.Counter(verses).items() if c > 1]
            error(f"wlc/: duplicate verse ids: {dup[:5]}")
    return words, verses


# ---------------------------------------------------------------- MAPM/

def load_mapm(root, check):
    """Return {verse id: text} for MAPM/MAPM.xml, or None if absent/unparseable."""
    path = os.path.join(root, "MAPM", "MAPM.xml")
    if not os.path.exists(path):
        return None
    doc = parse(path) if check else _quiet_parse(path)
    if doc is None:
        return None
    verses, current, skip = collections.OrderedDict(), None, 0

    def walk(el):
        nonlocal current, skip
        name = tag(el)
        if name == "verse":
            if el.get("sID"):
                if check and current is not None:
                    error(f"MAPM/MAPM.xml: verse {el.get('sID')} starts before {current} ends")
                current = el.get("sID")
                if check and current in verses:
                    error(f"MAPM/MAPM.xml: duplicate verse {current}")
                verses[current] = []
            elif el.get("eID"):
                if check and el.get("eID") != current:
                    error(f"MAPM/MAPM.xml: verse end {el.get('eID')} does not match open verse {current}")
                current = None
        muted = name in ("note", "title", "header")
        skip += muted
        if el.text and not skip:
            _text(el.text)
        for child in el:
            walk(child)
            if child.tail and not skip:
                _text(child.tail)
        skip -= muted

    def _text(s):
        if current is not None:
            verses[current].append(s)
        elif check and s.strip():
            error(f"MAPM/MAPM.xml: text outside any verse: {s.strip()[:30]!r}")

    walk(doc)
    if check and current is not None:
        error(f"MAPM/MAPM.xml: verse {current} is never closed")
    return {v: re.sub(r"\s+", " ", "".join(parts)).strip() for v, parts in verses.items()}


def _quiet_parse(path):
    try:
        return ET.parse(path).getroot()
    except (ET.ParseError, OSError):
        return None


def letters(s):
    return "".join(c for c in s if "א" <= c <= "ת")


# ---------------------------------------------------------------- report

def report(root, base, words, mapm):
    out = ["## Data change summary", ""]
    base_words, _ = load_wlc(base, check=False)
    added = [i for i in words if i not in base_words]
    removed = [i for i in base_words if i not in words]
    changed = []
    for wid, rec in words.items():
        old = base_words.get(wid)
        if old is None:
            continue
        fields = [f for f in ("text", "lemma", "morph", "n", "type", "verse") if rec[f] != old[f]]
        if fields:
            changed.append((wid, rec, old, fields))
    out.append("### wlc/")
    if not (added or removed or changed):
        out.append("No word-level changes.")
    else:
        per_field = collections.Counter(f for _, _, _, fs in changed for f in fs)
        out.append(f"- words changed: **{len(changed)}** "
                   f"({', '.join(f'{f}: {n}' for f, n in per_field.most_common()) or 'none'})")
        out.append(f"- word ids added: **{len(added)}**, removed: **{len(removed)}**")
        if changed:
            out += ["", "| verse | id | field | before | after |", "|---|---|---|---|---|"]
            rows = [(rec["verse"], wid, f, old[f], rec[f])
                    for wid, rec, old, fs in changed for f in fs]
            for v, wid, f, a, b in rows[:MAX_ROWS]:
                out.append(f"| {v} | `{wid}` | {f} | {a if a is not None else '(none)'} "
                           f"| {b if b is not None else '(none)'} |")
            if len(rows) > MAX_ROWS:
                out.append(f"| … | | | {len(rows) - MAX_ROWS} more rows not shown | |")
        for label, ids, src in (("added", added, words), ("removed", removed, base_words)):
            if ids:
                shown = ", ".join(f"`{i}` ({src[i]['verse']})" for i in ids[:30])
                out.append(f"- {label}: {shown}{' …' if len(ids) > 30 else ''}")
    out += ["", "### MAPM/"]
    base_mapm = load_mapm(base, check=False)
    if mapm is None or base_mapm is None:
        out.append("MAPM/MAPM.xml is missing or unreadable on one side; not compared.")
    elif mapm == base_mapm:
        out.append("No verse text changes.")
    else:
        shared = [v for v in mapm if v in base_mapm]
        differ = [v for v in shared if mapm[v] != base_mapm[v]]
        marks_only = [v for v in differ
                      if unicodedata.normalize("NFD", mapm[v]).replace(" ", "")
                      == unicodedata.normalize("NFD", base_mapm[v]).replace(" ", "")]
        cons = [v for v in differ if letters(mapm[v]) != letters(base_mapm[v])]
        out.append(f"- verses only in this revision: **{len(set(mapm) - set(base_mapm))}**, "
                   f"only in base: **{len(set(base_mapm) - set(mapm))}**")
        out.append(f"- shared verses whose text differs: **{len(differ)}** of {len(shared)} "
                   f"({len(marks_only)} differ only in spacing or mark order)")
        out.append(f"- of those, verses whose consonants differ: **{len(cons)}**"
                   + (f" — {', '.join(cons[:60])}{' …' if len(cons) > 60 else ''}" if cons else ""))
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
    for f in files:
        if f.endswith(".xml") and not f.startswith("wlc/") and f != "MAPM/MAPM.xml":
            parse(os.path.join(root, f))

    words, verses = load_wlc(root, check=True)
    mapm = load_mapm(root, check=True)
    if mapm is not None and verses:
        expected = set(verses) - MAPM_ABSENT
        got = set(mapm)
        if got != expected:
            extra, missing = sorted(got - expected), sorted(expected - got)
            error(f"MAPM/MAPM.xml: verse inventory differs from wlc/ "
                  f"(unexpected: {extra[:8]}{' …' if len(extra) > 8 else ''}; "
                  f"missing: {missing[:8]}{' …' if len(missing) > 8 else ''})")

    print(f"wlc/: {len(verses)} verses, {len(words)} words")
    if mapm is not None:
        print(f"MAPM/: {len(mapm)} verses")

    if args.base:
        summary = report(root, args.base, words, mapm)
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
