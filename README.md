#	Open Scriptures Hebrew Bible

The Open Scriptures Hebrew Bible (OSHB) is a project to analyze the Hebrew Bible
by lemma and morphology. The project is marked up in [OSIS][1] XML and currently
contains lemma attributes for most words (using an augmentation of Strong’s
numbers). We are in the process of adding morphology attributes as well.  These
files are found in the `wlc` directory.

Lemma and morphology data are licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project. The text of the WLC remains in the
[Public Domain](http://creativecommons.org/publicdomain/mark/1.0/).  See the [LICENSE](LICENSE.md) file for more information.

##	Word tag attributes

Word tags each contain three attributes:

-	`lemma` - Eg. `c/m/6529`

-	`morph` - Eg. `HC/R/Ncmsc`

-	`id` - Eg. `018xz`. This is a unique, immutable id for every word in the Hebrew Bible. The first two digits represent the KJV book number, and the last three are random. (Likewise will be done for the BHP and UGNT versions of the Greek New Testment.) The purpose of this id is two-fold. First, it allows software to easily associate other data with particular words in the original texts. Second, it helps facilitate textual criticsm. That is, another Hebrew Bible codex could utilize the same ids wherever words align, and create new ids where new words are found. Then, a software program can both highlight the discrepencies and maintain data associations build for another codex where words are consistent.

##	Additional Resources

-	`HomeFiles`, along with `index.html` provide a simple home page for the project,
see [The OpenScriptures Hebrew Bible](http://openscriptures.github.io/morphhb/)

-	`MAPM` contains our work with the
[Miqra according to the Mesorah](https://he.wikisource.org/wiki/%D7%9E%D7%A9%D7%AA%D7%9E%D7%A9:Dovi/%D7%9E%D7%A7%D7%A8%D7%90_%D7%A2%D7%9C_%D7%A4%D7%99_%D7%94%D7%9E%D7%A1%D7%95%D7%A8%D7%94)
These were done in cooperation with Rabbi Kadish, for comparison with the OSHB.
The MapM has since progressed, so our files may not be up to date.

-	`OSHB Graphics` contains the OSHB logo graphics, for crediting or linking to
our resources.  See the `readme` in that directory for more details.

-	`structure` contains a demo of OSHB Verse, for displaying verses of the Hebrew
Bible divided by the cantillation hierarchy.  This is a simple implementation
for using the `n` attributes that have been added, for recording and editing
the cantillation divisions.

##	Hebrew Normalization

The [SBL Hebrew User Manual](http://www.sbl-site.org/Fonts/SBLHebrewUserManual1.5x.pdf)
has a section entitled, The normalisation issue, pp. 8 ff.

>	Normalisation is a process by which sequences of characters in text that
can be variously encoded but are _semantically identical_ are treated as
identically encoded. (p. 8)

Because of the warnings in that manual, along with my experiences dealing
with the MapM text from WikiSource, any uses of the OSHB should avoid NFC
normalization.

Updated: January 27, 2017

[1]: http://bibletechnologies.net/

## Perl script for JSON output

There is a perl script which generates a JSON version of the morphology which is published to npm here:
https://www.npmjs.com/package/morphhb

This JavaScript module is designed to be lightweight, so it is formatted as follows:

- Each book is a key, value pair in the Object.
- The key is the book name
- The value is an array of chapters
- Each chapter is an array of verses
- Each verse is an array of words
- Each word is an array of the following
- [ 'wordString', 'lemma', 'morphology' ]

The perl script which generates this is called morphhbXML-to-JSON.pl. It has several options:
- stripPointing: This will remove all non-letter characters from the Hebrew words. These characters are a later addition in the history of the text.
- removeLemmaTypes: Some Strongs numbers have an additional type in the form of a letter. This isn't implemented in the strongs dictionary, so this option will remove them.
- prefixLemmasWithH: To differentiate Greek and Hebrew strongs numbers we can add an additional H at the start
- remapVerses: The versification in Hebrew and English bibles is different. This option maps the Hebrew verses to the English ones.

You can run this script like so:

    `perl morphhbXML-to-JSON.pl --stripPointing --removeLemmaTypes --prefixLemmasWithH --remapVerses`


## Python script with Docker

There is also a Python script to transform the data into a JSON file. 

It has similar arguments as the perl script above, but it has the argument `--splitByBook`.

Use `--splitByBook` to create a JSON file per book.

The python script can be run in a Docker container based on the `Dockerfile` in the main directory. To build the docker image
and run the container, use the following commands (possibly as root):

    docker build . -t local/morphhb && docker run -it -v `pwd`:/var/app local/morphhb
