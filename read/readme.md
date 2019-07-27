#	OSHB Read

Now that the parsing project has completed the first pass of adding
morphology to the OpenScriptures Hebrew Bible, there is a need for a
way to present the text in a readable form. This will provide access
to the morphology, for reference purposes.

OSHB Read is a prototype for that application. This initial release is
for testing purposes. Comments are welcome. Installing the app
requires the same relationship between the read directory and the wlc
directory.  (Otherwise, the relative path can be changed in
Script/Read.js, line 93.)

The first update implements the verse selector. This highlights the
selected verse, and scrolls it into view.

The latest update adds the morphology parser to interpret the morphology
codes in the popups. For anyone interested in using the parser in their
own project, the functionality has been encapsulated in
MorphologyParser.js.

Several components have been adapted from OSHB Verse, we have:

-	AccentCatalog.js catalogs the accents by type and scope.

-	Books.js records book data for navigation.

-	ReferenceConversion.js converts an osisID to a scripture reference.

-	AccentInterpretation.js interprets a string of cantillation marks.  
	It depends on AccentCatalog.js
	
-	Popup.js marks up the popup for each word.  
	It depends on AccentInterpretation.js
	
-	ElementMarkup.js marks up the words, punctuation and notes.  
	It depends on Popup.js
	
-	ChapterMarkup.js marks up the chapter to be viewed.  
	It depends on ReferenceConversion.js and ElementMarkup.js
	
-	Read.js in the controller for OSHB Read.  
	It depends on ChapterMarkup.js.

-	SelectVerse.js (added 7/24/2019) adds a class name to the selected
	verse and scrolls it into view.

-	MorphologyParser.js (added 7/27/2019) encapsulates the morphology
	parser. It returns an object, for the purpose of verifying and
	providing hints for partial results. In clickWord we use
	morphologyParser(data.morph).

-	ClickWord.js (Added 7/27/2019) provides the click handler for
	words. It depends on MorphologyParser.js.

For more information on the project, see our website
[OpenScriptures Hebrew Bible](https://hb.openscriptures.org/).

OSHB Read is licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project.

Updated July 27, 2019
Updated July 24, 2019
July 21, 2019
