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
[Public Domain](http://creativecommons.org/publicdomain/mark/1.0/).

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