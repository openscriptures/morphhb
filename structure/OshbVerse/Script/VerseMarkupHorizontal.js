/**
 * @fileOverview VerseMarkupHorizontal is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupVertical
 * for alternate display, with the appropriate Passage styles.
 * @version 1.2
 * Version 1.2: Updated for the addition of binary tree layout.
 * Version 1.1: Updated for popup display.
 * @author David
 */
verseMarkupHorizontal = function() {
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
    // Recursive function to mark up blocks in a binary tree.
    // TODO: Implement Depth layout. Also maybe different thickness of border by level.
    function blockElementBT(lines, level) {
		var limit = lines.length;
		if (limit === 1) {
			//TODO Nest span elements, up to level 3.
            var span = spanElement('level' + (level + 1));
			span.appendChild(nestElement(lines[0].line, level));
			return span;
		}
        // Recursive breakdown of blocks.
        var index = 2 * level, i = 0, code = lines[0].code.charAt(index);
        for (; i < limit; i++) {
            if (code !== lines[i].code.charAt(index)) {
                // When the code at that level changes.
                break;
            }
        }
        var span = spanElement('level' + level);
        span.appendChild(blockElementBT(lines.slice(0, i), level + 1));
        if (i < limit) {
            span.appendChild(blockElementBT(lines.slice(i, limit), level));
        }
        if (span.childElementCount === 1) {
            return span.firstChild;
        } else {
            return span;
        }
    }
    // Recursive function to mark up blocks cleaner than binary tree.
    function blockElementClean(lines, level) {
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
                span.appendChild(blockElementClean(block, level + 1));
                block.splice(0, block.length);
                code = test;
            }
            block.push(lines[i]);
        }
        span.appendChild(blockElementClean(block, level + 1));
        return span;
    }
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
    // Marks up the verse.
    function verseElement(verse, binaryTree) {
		var lines = verseLines(verse),
			sec = document.createElement('section'),
			heading = document.createElement('h3');
		heading.appendChild(document.createTextNode(refConvert(verse.getAttribute('osisID'))));
		sec.appendChild(heading);
        if (binaryTree) {
            sec.appendChild(blockElementBT(lines, 0));
        } else {
            sec.appendChild(blockElementClean(lines, 0));
        }
		return sec;
    }
	return function(verse, binaryTree) {
		return verseElement(verse, binaryTree);
	};
}();
