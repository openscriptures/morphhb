/**
 * @fileOverview VerseMarkupVertical is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupHorizontal
 * for alternate display, with the appropriate Passage styles.
 * @version 1.2
 * Version 1.2: Updated for the addition of binary tree layout.
 * Version 1.1: Updated for popup display.
 * @author David
 */
/* TODO: Refactor and merge with VerseMarkupHorizontal. */
verseMarkupVertical = function() {
    // Sequences the verse content by structure.
    var verseLines = window.elementMarkup;
	// Sets up a div element.
	function divElement(className) {
		var div = document.createElement('div');
		div.className = className;
		return div;
	}
    // Recursive function to mark up blocks in a binary tree.
	function blockElementBT(lines, level) {
		var limit = lines.length;
		if (limit === 1) {
            var div = divElement('level' + (level + 1));
			div.appendChild(lines[0].line);
			return div;
		}
		// Recursive breakdown of blocks.
        var index = 2 * level, i = 0, code = lines[0].code.charAt(index);
        for (; i < limit; i++) {
            if (code !== lines[i].code.charAt(index)) {
                // When the code at that level changes.
                break;
            }
        }
        var div = divElement('level' + level);
        div.appendChild(blockElementBT(lines.slice(0, i), level + 1));
        if (i < limit) {
            div.appendChild(blockElementBT(lines.slice(i, limit), level));
        }
        if (div.childElementCount === 1) {
            return div.firstChild;
        } else {
            return div;
        }
	}
    // Recursive function to mark up blocks cleaner than binary tree.
	function blockElementClean(lines, level) {
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
				div.appendChild(blockElementClean(block, level + 1));
				block.splice(0, block.length);
				code = test;
			}
			block.push(lines[i]);
		}
		div.appendChild(blockElementClean(block, level + 1));
		return div;
	}
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
	// Constructs the verse element.
	function verseElement(verse, binaryTree) {
		var lines = verseLines(verse),
			sec = document.createElement('section'),
			heading = document.createElement('h3'),
			foot = document.createElement('div');
		heading.appendChild(document.createTextNode(refConvert(verse.getAttribute('osisID'))));
		sec.appendChild(heading);
        if (binaryTree) {
            sec.appendChild(blockElementBT(lines, 0));
        } else {
            sec.appendChild(blockElementClean(lines, 0));
        }
		foot.id = 'foot';
		sec.appendChild(foot);
		return sec;
	}
	return function(verse, binaryTree) {
		return verseElement(verse, binaryTree);
	};
}();
