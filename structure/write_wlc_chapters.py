"""
Write individual files for each chapter of WLC.
"""

from os import listdir, mkdir
from os.path import join
from xml.dom.minidom import Document, parse

WLC_DIR = "../wlc/"
OUTPUT_DIR = "./OshbVerse/chapters"

def try_mkdir(path):
    try:
        mkdir(path)
    except OSError as e:
        print path, "already exist?"

def write_chapter(filename, book):
    dom = parse(filename)

    for c in dom.getElementsByTagName("chapter"):
        doc = Document()
        doc.appendChild(c)
        c_filename = join(OUTPUT_DIR, book, c.getAttribute("osisID") + ".xml")
        with open(c_filename, "w") as f:
            f.write(doc.toxml(encoding="utf-8"))

if __name__ == "__main__":
    try_mkdir(OUTPUT_DIR)

    for f in listdir(WLC_DIR):
        if f != "VerseMap.xml":
            book = f.split(".")[0]
            try_mkdir(join(OUTPUT_DIR, book))
            write_chapter(join(WLC_DIR, f), book)
