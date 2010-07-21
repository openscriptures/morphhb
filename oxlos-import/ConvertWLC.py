#!/usr/bin/env python
# -*- coding: utf8 -*-

#Copyright (c) 2010 Jesse Griffin
#http://creativecommons.org/licenses/MIT/
#
#Permission is hereby granted, free of charge, to any person obtaining a copy
#of this software and associated documentation files (the "Software"), to deal
#in the Software without restriction, including without limitation the rights
#to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#copies of the Software, and to permit persons to whom the Software is
#furnished to do so, subject to the following conditions:
#
#The above copyright notice and this permission notice shall be included in
#all copies or substantial portions of the Software.
#
#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
#THE SOFTWARE.

from xml.dom import minidom
import os

class ConvertWLC():
    '''
    This class converts the XML WLC files to a single flat file.
    '''

    def __init__(self):
        self.bookdir = '../wlc'
        #self.books = os.listdir(self.bookdir)
        self.books = ["Gen","Exod","Lev","Num", "Deut", "Josh", "Judg", "Ruth","1Sam","2Sam",
        "1Kgs","2Kgs","1Chr", "2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa",
        "Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal"]
        self.wlcflat = 'wlc_flat.txt'

    def transformwlc(self):
        print 'Trying to delete old %s' % self.wlcflat
        try: os.remove(self.wlcflat)
        except: pass
        print "Creating flat file..."
        self.wlcf = open(self.wlcflat, 'w')
        for self.book in self.books:
            print self.book
            bookxml = minidom.parse('./%s/%s.xml' % (self.bookdir, self.book))
            chapterlist = bookxml.getElementsByTagName('chapter')
            self.c = 1
            for chap in chapterlist:
                chapterxml = chapterlist[self.c - 1]
                verselist = chapterxml.getElementsByTagName('verse')
                self.v = 1
                for verse in verselist:
                    self.myverse = verse
                    self.mywelements = self.myverse.getElementsByTagName('w')
                    self.elnum = 0
                    for el in self.mywelements:
                        self.elnum += 1
                        try:
                            # Previous format:  '%s, %d, %d, %s, %s'
                            print >> self.wlcf, '%s %d:%d.%d\t%s\t%s' % (self.book.strip('.xml'), self.c, self.v, self.elnum, el.attributes['lemma'].value.encode('utf-8'), el.firstChild.data.encode('utf-8'))
                        except KeyError:
                            print >> self.wlcf, '%s %d:%d.%d\t%s\t%s' % (self.book.strip('.xml'), self.c, self.v, self.elnum, '0', el.firstChild.data.encode('utf-8'))
                    self.v += 1
                self.c += 1
        self.wlcf.close()
            
if __name__ == '__main__':
    c = ConvertWLC()
    c.transformwlc()
