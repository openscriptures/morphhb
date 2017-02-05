#	Cantillation Structure

Structure attributes have been added to the OpenScriptures Hebrew Bible.
Under @n you will find single numbers, indicating the major divisions
of the verse. Lower divisions beneath these are indicated by decimals
after the major number, etc.

OshbVerse is a demonstration of two possible methods of visualizing
these divisions in code. I have refactored the code the separate the
verse markup options, using VerseMarkupHorizontal.js or
VerseMarkupVertical.js. Each one requires its own CSS styles:
PassageHorizontal.css and PassageVertical.css, respectively. The app is
initially set up for horizontal display. This view is more suggestive
of the true breakdown, but sensitive to things like font changes. The
vertical display is the form of the old demo app. To change forms,
the style and script references can be changed in index.html. See the
notes in that file.

All the rest of the files are just scaffolding for the demo. These include
select chapters of the OSHB, included as JavaScript strings. Genesis
chapters 1, 8 and 32, and Psalm 1 are included. Any other choice defaults
to Genesis 1. The selected chapter is parsed into a DOM document. Then
selected verses are extracted and marked up. In production, the same could
be done with a responseXML to an Ajax request.

I have been using the cantillation breakdown for several years, and find it
very beneficial to understanding scripture. I have included it as one of the
four factes of biblical study we are emphasizing with the OSHB. There is also
a brief introduction, with references, on our
[Cantillation](http://openscriptures.github.io/morphhb/HomeFiles/Accents.html)
page.

The OshbVerse demo is licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project.

February 5, 2017