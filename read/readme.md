#	OSHB Read

Now that the parsing project has completed the first pass of adding
morphology to the OpenScriptures Hebrew Bible, there is a need for a
way to present the text in a readable form. This will provide access
to the morphology, for reference purposes.

OSHB Read is a prototype for that application. This initial release is
for testing purposes. Comments are welcome. Installing the app
requires the same relationship between the read directory and the wlc
directory.  (Otherwise, the relative path can be changed in
Script/Read.js, line 91.)

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

For more information on the project, see our website
[OpenScriptures Hebrew Bible](https://hb.openscriptures.org/).

OSHB Read is licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project.
 
July 21, 2019
