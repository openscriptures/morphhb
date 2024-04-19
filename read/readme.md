#	OSHB Read

OSHB Read is an application for reading the Open Scriptures Hebrew
Bible, direct from the source text. You always get the latest version
we have available. This includes the completed morphology, from the
first pass.

Open the app and select a book. Once it loads, you can choose a
chapter to read. The entire chapter is in front of you. The verse
selector simply provides a way to zero in on a specific passage
quickly. It will highlight the selected verse, and scroll it into view.

The words you see are actually divided into prefixes, main word and
suffix. Hovering over a part of the word yields a popup showing the
lemma (for lookup in the
[OSHB Hebrew Lexicon](http://openscriptures.github.io/HebrewLexicon/)),
the morphology code and the accent of the word in general. If you
want to view a readable rendering of the morphology code, click on that
part of the word, and it will be shown in a box below the text.

For anyone interested in using the morphology parser in their own
project, the functionality has been encapsulated in
MorphologyParser.js.

Several components have been adapted from
[OSHB Verse](https://hb.openscriptures.org/structure/OshbVerse/),
we have:

-	ReferenceLocation.js (Added 4/19/2024) manages URL locations, to
	make and process the link.
	
-	AccentCatalog.js catalogs the accents by type and scope.

-	Books.js records book data for navigation.

-	ReferenceConversion.js converts an osisID to a scripture reference.

-	AccentInterpretation.js interprets a string of cantillation marks.
	(Refactored 7/27/2019 for chapter markup.)  
	It depends on AccentCatalog.js
	
-	Popup.js marks up the popup for each word.  
	It depends on AccentInterpretation.js
	
-	ElementMarkup.js marks up the words, punctuation and notes.
	(Refactored 8/30/2019 for segmentation. Corrected 9/18/2019.)  
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
	morphologyParser(data.lang + data.morph).

-	ClickWord.js (Added 7/27/2019) provides the click handler for
	words.  
	It depends on MorphologyParser.js.

For more information on the project, see our website
[OpenScriptures Hebrew Bible](https://hb.openscriptures.org/).

OSHB Read is licensed under a
[Creative Commons Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/)
license. For attribution purposes, credit the Open Scriptures Hebrew Bible
Project.

Updated April 19, 2024 (marcstober)
Updated September 18, 2019  
Updated August 30, 2019  
Updated July 27, 2019  
Updated July 24, 2019  
July 21, 2019
