/**
 * @fileOverview VerseMarkupVertical is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupHorizontal
 * for alternate display, with the appropriate Passage styles.
 * @version 1.1
 * Updated for popup display.
 * @author David
 */
verseMarkupVertical = function() {
    // Sequences the verse content by structure.
    var verseLines = window.elementMarkup;
	// Sets up a div element.
	function divElement(className) {
		var div = document.createElement('div');
		div.className = className;
		return div;
	}
	// Recursive function to construct block elements.
	function blockElement(lines, level) {
		var limit = lines.length, div = divElement('level' + level);
		if (limit === 1) {
			div.appendChild(lines[0].line);
			return div;
		}
		// Recursive breakdown of blocks.
		var index = 2 * level, block = [], i = 0, test,
			code = lines[0].code.charAt(index);
		for (; i < limit; i++) {
			test = lines[i].code.charAt(index);
			if (test !== code) {
				div.appendChild(blockElement(block, level + 1));
				block.splice(0, block.length);
				code = test;
			}
			block.push(lines[i]);
		}
		div.appendChild(blockElement(block, level + 1));
		return div;
	}
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
	// Constructs the verse element.
	function verseElement(verse) {
		var lines = verseLines(verse),
			sec = document.createElement('section'),
			heading = document.createElement('h3'),
			foot = document.createElement('div');
		heading.appendChild(document.createTextNode(refConvert(verse.getAttribute('osisID'))));
		sec.appendChild(heading);
		sec.appendChild(blockElement(lines, 0));
		foot.id = 'foot';
		sec.appendChild(foot);
		return sec;
	}
	return function(verse) {
		return verseElement(verse);
	};
}();
