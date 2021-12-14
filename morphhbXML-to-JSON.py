# !/usr/bin/python3
# encoding=utf8

import re
import copy
import sys
import getopt
import json
import os
from xml.etree import ElementTree as ET

bookNameData = {}

bookNameData['Gen'] = 'Genesis'
bookNameData['Exod'] = 'Exodus'
bookNameData['Lev'] = 'Leviticus'
bookNameData['Num'] = 'Numbers'
bookNameData['Deut'] = 'Deuteronomy'
bookNameData['Josh'] = 'Joshua'
bookNameData['Judg'] = 'Judges'
bookNameData['Ruth'] = 'Ruth'
bookNameData['1Sam'] = 'I Samuel'
bookNameData['2Sam'] = 'II Samuel'
bookNameData['1Kgs'] = 'I Kings'
bookNameData['2Kgs'] = 'II Kings'
bookNameData['1Chr'] = 'I Chronicles'
bookNameData['2Chr'] = 'II Chronicles'
bookNameData['Ezra'] = 'Ezra'
bookNameData['Neh'] = 'Nehemiah'
bookNameData['Esth'] = 'Esther'
bookNameData['Job'] = 'Job'
bookNameData['Ps'] = 'Psalms'
bookNameData['Prov'] = 'Proverbs'
bookNameData['Eccl'] = 'Ecclesiastes'
bookNameData['Song'] = 'Song of Solomon'
bookNameData['Isa'] = 'Isaiah'
bookNameData['Jer'] = 'Jeremiah'
bookNameData['Lam'] = 'Lamentations'
bookNameData['Ezek'] = 'Ezekiel'
bookNameData['Dan'] = 'Daniel'
bookNameData['Hos'] = 'Hosea'
bookNameData['Joel'] = 'Joel'
bookNameData['Amos'] = 'Amos'
bookNameData['Obad'] = 'Obadiah'
bookNameData['Jonah'] = 'Jonah'
bookNameData['Mic'] = 'Micah'
bookNameData['Nah'] = 'Nahum'
bookNameData['Hab'] = 'Habakkuk'
bookNameData['Zeph'] = 'Zephaniah'
bookNameData['Hag'] = 'Haggai'
bookNameData['Zech'] = 'Zechariah'
bookNameData['Mal'] = 'Malachi'

stripPointing = False
removeLemmaTypes = False
stripHFromMorph = False
prefixLemmasWithH = False
remapVerses = False
splitByBook = False


def getBookData(filename):
    tree = ET.parse(filename)
    namespaces = {
        'osis': 'http://www.bibletechnologies.net/2003/OSIS/namespace'}

    chapters = tree.getroot().findall('.//osis:chapter', namespaces)

    bookData = []

    for chapter in chapters:
        verses = chapter.findall('.//osis:verse', namespaces)
        verseArray = []

        for verse in verses:
            words = verse.findall('.//osis:w', namespaces)
            wordArray = []

            for word in words:
                singleWordArray = []

                lemma = word.attrib.get('lemma')

                if removeLemmaTypes:
                    lemma = removeLemmaTypesFunc(lemma)
                if prefixLemmasWithH:
                    # print(lemma)
                    lemma = prefixLemmasWithHFunc(lemma)
                    # print(lemma)

                morph = word.attrib.get('morph')

                if morph and stripHFromMorph:
                    morph = stripHFromMorphFunc(morph)

                singleWordArray.append(word.text)
                singleWordArray.append(lemma)
                singleWordArray.append(morph)

                wordArray.append(singleWordArray)

            verseArray.append(wordArray)

        bookData.append(verseArray)

    return bookData


def prefixLemmasWithHFunc(lemmaString):
    lemmaArray = lemmaString.split('/')
    returnArray = []
    for lemma in lemmaArray:
        returnArray.append('H' + lemma)
    returnString = '/'.join(returnArray)
    return returnString


def stripHFromMorphFunc(string):
    if string.find('H') == 0:
        return string[1:]

    return string


def removeLemmaTypesFunc(string):
    return re.sub(r" [abcdef]|\+", "", string)


def stripPointingFunc(string):
    return re.sub(r"[\u0591-\u05c7]", "", string)


def getCommandOptions(argv):
    global stripPointing
    global removeLemmaTypes
    global stripHFromMorph
    global prefixLemmasWithH
    global remapVerses
    global splitByBook

    try:
        opts, args = getopt.getopt(argv, "h:",
                                   [
                                       "stripPointing",
                                       "removeLemmaTypes",
                                       "stripHFromMorph",
                                       "prefixLemmasWithH",
                                       "remapVerses",
                                       "splitByBook"
                                   ])
    except getopt.GetoptError:
        print('python3 morphhb.py --stripPointing --removeLemmaTypes --stripHFromMorph --prefixLemmasWithH --remapVerses --splitByBook')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print('python3 morphhb.py --stripPointing --removeLemmaTypes --stripHFromMorph --prefixLemmasWithH --remapVerses --splitByBook')
            sys.exit()
        elif opt in ("--stripPointing"):
            print('stripPointing')
            stripPointing = True
        elif opt in ("--removeLemmaTypes"):
            print('removeLemmaTypes')
            removeLemmaTypes = True
        elif opt in ("--stripHFromMorph"):
            print('stripHFromMorph')
            stripHFromMorph = True
        elif opt in ("--prefixLemmasWithH"):
            print('prefixLemmasWithH')
            prefixLemmasWithH = True
        elif opt in ("--remapVerses"):
            print('remapVerses')
            remapVerses = True
        elif opt in ("--splitByBook"):
            print('splitByBook')
            splitByBook = True


def main():

    hebrew = {}
    for bookNameShort in bookNameData.keys():
        hebrew[bookNameData[bookNameShort]] = getBookData(
            'wlc/' + bookNameShort + '.xml')

    # map hebrew to english verses
    filename = 'wlc/VerseMap.xml'
    tree = ET.parse(filename)
    namespaces = {'vm': 'http://www.APTBibleTools.com/namespace'}
    books = tree.getroot().findall('.//vm:book', namespaces)

    # must use deep copy here
    remapped = copy.deepcopy(hebrew)

    for book in books:
        verses = book.findall('.//vm:verse', namespaces)

        for verse in verses:
            if verse.attrib['type'] == 'full':
                # take the wlc verse and move it to the kjv position
                wlcRef = verse.attrib['wlc']
                wlcVerseArray = wlcRef.split('.')
                kjvRef = verse.attrib['kjv']
                kjvVerseArray = kjvRef.split('.')

                kjvBook = bookNameData[kjvVerseArray[0]]
                kjvChapter = int(kjvVerseArray[1]) - 1
                kjvVerse = int(kjvVerseArray[2]) - 1

                wlcBook = bookNameData[wlcVerseArray[0]]
                wlcChapter = int(wlcVerseArray[1]) - 1
                wlcVerse = int(wlcVerseArray[2]) - 1

                wlcData = hebrew[wlcBook][wlcChapter][wlcVerse]

                if kjvBook == 'Psalms' and kjvVerse == 0:
                    remapped[kjvBook][kjvChapter][kjvVerse] = hebrew[wlcBook][wlcChapter][wlcVerse - 1] + wlcData
                    remapped[wlcBook][wlcChapter][wlcVerse] = []
                else:
                    if kjvChapter >= len(remapped[kjvBook]):
                        remapped[kjvBook].append([])
                    if kjvVerse >= len(remapped[kjvBook][kjvChapter]):
                        remapped[kjvBook][kjvChapter].append([])
                    remapped[kjvBook][kjvChapter][kjvVerse] = wlcData.copy()
                    if wlcChapter < kjvChapter or (wlcChapter == kjvChapter and wlcVerse > kjvVerse) or wlcChapter > kjvChapter:
                        remapped[wlcBook][wlcChapter][wlcVerse] = []

        # delete those empty entries now
        verses.reverse()
        for verse in verses:
            if verse.attrib['type'] == 'full':
                wlcRef = verse.attrib['wlc']
                wlcVerseArray = wlcRef.split('.')

                wlcBook = bookNameData[wlcVerseArray[0]]
                wlcChapter = int(wlcVerseArray[1]) - 1
                wlcVerse = int(wlcVerseArray[2]) - 1

                if len(remapped[wlcBook][wlcChapter][wlcVerse]) == 0:
                    del remapped[wlcBook][wlcChapter][wlcVerse]

    # Fix partial verses manually
    remapped['I Kings'][17][32] = hebrew['I Kings'][17][32] + \
        hebrew['I Kings'][17][33]
    remapped['I Kings'][17][32][19:43] = []
    remapped['I Kings'][17][33][0:10] = []
    remapped['I Kings'][19][1] = hebrew['I Kings'][19][1] + \
        hebrew['I Kings'][19][2]
    remapped['I Kings'][19][1][13:34] = []
    remapped['I Kings'][19][2][0:6] = []

    remapped['I Kings'][21][20][8:19] = []
    remapped['I Kings'][21][21] = hebrew['I Kings'][21][20] + \
        hebrew['I Kings'][21][21]
    remapped['I Kings'][21][21][0:8] = []

    remapped['I Kings'][21][42] = hebrew['I Kings'][21][42] + \
        hebrew['I Kings'][21][43]

    remapped['Isaiah'][63][0] = hebrew['Isaiah'][62][18].copy()
    remapped['Isaiah'][62][18][8:23] = []
    remapped['Isaiah'][63][0][0:8] = []

    remapped['Psalms'][12][4] = hebrew['Psalms'][12][4].copy()
    remapped['Psalms'][12].append([])
    remapped['Psalms'][12][5] = hebrew['Psalms'][12][4].copy()
    remapped['Psalms'][12][4][6:16] = []
    remapped['Psalms'][12][5][0: 6] = []

    if remapVerses:
        final = remapped
    else:
        final = hebrew

    name = 'remapped' if remapVerses else 'hebrew'

    if splitByBook:
        output_dir = os.path.join('./json', name)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        for book in final:
            target_file = os.path.join(output_dir, book.replace(" ", "").lower())
            with open(target_file + '.json', 'w', encoding='utf8') as f:
                json.dump(final[book], f, ensure_ascii=False)
    else:
        with open(name + '.json', 'w', encoding='utf8') as f:
            json.dump(final, f, ensure_ascii=False)


if __name__ == "__main__":
    getCommandOptions(sys.argv[1:])
    main()
