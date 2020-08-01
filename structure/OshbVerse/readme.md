#	Cantillation Structure

Structure attributes have been added to the OpenScriptures Hebrew Bible.
For words with disjunctive accents you will find single numbers under the
"n" attribute, indicating the major divisions of the verse. Lower
divisions beneath these are indicated by decimals after the major
number, etc.

OshbVerse is a demonstration of two possible methods of visualizing
these divisions in code. The code currently has separate verse markup
options, using VerseMarkupHorizontal.js or VerseMarkupVertical.js. Each
one requires its own CSS style: PassageHorizontal.css and
PassageVertical.css, respectively. The app is initially set up for
horizontal display. This view is more suggestive of the true breakdown,
and has been made more solid in the current release.  The vertical
display is the layout of the old demo app.  Each of these layouts can
visualize the verse structure either in "binary tree" form (the default,
where colors help discern the role of the accent), or in "clean" form.

We have now added the capability to link to the current verse. This will
allow sharing a link or making a bookmark, to return to the same location.

Many of the files are just scaffolding for the demo. Installing the demo
requires the same relationship between the structure directory and the
wlc directory.  (Otherwise, the relative path can be changed in
Script/Structure.js, line 99.)

Several new components have been added to facilitate the popup display, and
interpretation of the cantillation marks. Altogether, we have:

-	ReferenceLocation.js (Added 8/2/2019) manages URL locations, to
	make and process the link. Expanded 8/1/2020, to accept the MT book
	number, as well as the SBL abbreviation, in the URL.

-	AccentCatalog.js catalogs the accents by type and scope.

-	Books.js records book data for navigation.

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

Updated August 1, 2020  
Updated August 2, 2019  
Updated June 9, 2018  
Updated June 22, 2017  
Updated February 17, 2017  
February 5, 2017
