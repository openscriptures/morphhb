/**
 * @fileOverview ChapterMarkup is a markup component for OshbRead.
 * @version 1.0
 * @author David
 */
chapterMarkup = function() {
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
	// Marks up the sequence of verses.
	function verseElements(verses) {
		var para = document.createElement('p'),
			i = 0, lim = verses.length;
		for (; i < lim; i++) {
			// Send verses to ElementMarkup.
			para.appendChild(elementMarkup(verses[i]));
		}
		return para;
	}
    // Marks up the chapter.
	function chapterElement(chapter) {
		var verses = chapter.getElementsByTagName('verse'),
			sec = document.createElement('section'),
			heading = document.createElement('h3');
		heading.appendChild(document.createTextNode(refConvert(chapter.getAttribute('osisID'))));
		sec.appendChild(heading);
		// Append verses.
		sec.appendChild(verseElements(verses));
		return sec;
	}
	return function(chapter) {
		return chapterElement(chapter);
	};
}();