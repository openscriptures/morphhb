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
of the true breakdown, and has been made more solid in the current release.
The vertical display is the form of the old demo app. To change forms,
the style and script references can be changed in index.html. See the
notes in that file.

Many of the files are just scaffolding for the demo. These include
select chapters of the OSHB, included as JavaScript strings. Genesis
chapters 1, 8 and 32, and Psalm 1 are included. Any other choice defaults
to Genesis 1. The selected chapter is parsed into a DOM document. Then
selected verses are extracted and marked up. In production, the same could
be done with a responseXML to an Ajax request.

Several new components have been added to facilitate the popup display, and
interpretation of the cantillation marks. Altogether, we have:

-	AccentCatalog.js catalogs the accents by type and scope.

-	Books.js records book data for navigation.

-	Chapter.js holds Genesis 1.

-	Gen8.js holds Genesis 8.

-	Gen32.js holds Genesis 32.

-	Ps1.js holds Psalm 1.

-	ReferenceConversion.js converts an osisID to a scripture reference.

-	AccentInterpretation.js interprets a string of cantillation marks.  
	It depends on AccentCatalog.js
	
-	Popup.js marks up the popup for each word.  
	It depends on AccentInterpretation.js
	
-	ElementMarkup.js marks up the words, punctuation and notes.  
	It depends on Popup.js
	
-	VerseMarkupVertical.js marks up the vertical structure.  
	It depends on ReferenceConversion.js and ElementMarkup.js
	
-	VerseMarkupHorizontal.js marks up the horizontal structure.  
	It depends on ReferenceConversion.js and ElementMarkup.js
	
-	Structure.js in the controller for OshbVerse.  
	It depends on VerseMarkupHorizontal.js or VerseMarkupVertical.js,  
	and AccentInterpretation.js to set the scope.

I have been using the cantillation breakdown for a number of years, and find it
very beneficial in understanding scripture. I have included it as one of the
four facets of biblical study we are emphasizing with the OSHB. There is also
a brief introduction, with references, on our
[Cantillation](http://openscriptures.github.io/morphhb/HomeFiles/Accents.html)
page. Of course, more information could be provided in the popups, and the same
data could be used for lexicon lookups, morphology expansion and deeper
cantillation study.

The OshbVerse demo is licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project.

Updated February 17, 2017  
February 5, 2017