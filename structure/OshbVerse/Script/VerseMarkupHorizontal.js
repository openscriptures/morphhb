/**
 * @fileOverview VerseMarkupHorizontal is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupVertical
 * for alternate display, with the appropriate Passage styles.
 * @version 1.1
 * Updated for popup display.
 * @author David
 */
verseMarkup = function() {
    // Sequences the verse content by structure.
    var verseLines = window.elementMarkup;
	// Sets up a span element.
	function spanElement(className) {
		var span = document.createElement('span');
		span.className = className;
		return span;
	}
	// Recursive function to nest blocks.
	function nestElement(node, level) {
		if (level < 4) {
			var span = spanElement('pad');
			span.appendChild(node);
			return nestElement(span, level + 1);
		}
		return node;
	}
    // Recursive function to mark up blocks.
    function blockElement(lines, level) {
		var limit = lines.length, span = spanElement('level' + level);
		if (limit === 1) {
			//TODO Nest span elements, up to level 3.
			span.appendChild(nestElement(lines[0].line, level));
			return span;
		}
        // Recursive breakdown of blocks.
        var index = 2 * level, block = [], i = 0, test,
            code = lines[0].code.charAt(index);
        for (; i < limit; i++) {
            test = lines[i].code.charAt(index);
            if (test !== code) { // When the code at that level changes.
				span.appendChild(blockElement(block, level + 1));
				block.splice(0, block.length);
				code = test;
            }
            block.push(lines[i]);
        }
		span.appendChild(blockElement(block, level + 1));
		return span;
    }
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
    // Marks up the verse.
    function verseElement(verse) {
		var lines = verseLines(verse),
			sec = document.createElement('section'),
			heading = document.createElement('h3');
		heading.appendChild(document.createTextNode(refConvert(verse.getAttribute('osisID'))));
		sec.appendChild(heading);
		sec.appendChild(blockElement(lines, 0));
		return sec;
    }
	return function(verse) {
		return verseElement(verse);
	};
}();