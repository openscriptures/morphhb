/**
 * @fileOverview VerseMarkupHorizontal is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupVertical
 * for alternate display, with the appropriate Passage styles.
 * @version 1.0
 * @author David
 */
verseMarkup = function() {
	// Constructe the item markup for a word.
	function markupItem(word, isQere) {
		var markup = '<span class="item">',
			morph = word.hasAttribute('morph') ? word.getAttribute('morph') : '&nbsp;';
		markup += isQere ? '<span class="qere" title="qere">' : '';
		markup += '<span class="Hebrew">' + word.firstChild.nodeValue + '</span>';
		markup += isQere ? '</span>' : '';
		markup += '<span class="lemma">' + word.getAttribute('lemma') + '</span>';
		markup += '<span class="morph">' + morph + '</span>';
		markup += '</span>';
		return markup;
	}
    // Constructs the markup for a qere note.
    function markupQere(qere) {
        var child = qere.getElementsByTagName('rdg')[0].firstChild,
            markup = ' ';
        while (child) {
            if (child.nodeType === 3) { // Whitespace in the source.
                markup += '<span class="punctuation"> </span>';
            }
            switch (child.nodeName) {
                case 'w':
                    markup += markupItem(child, true);
                    break;
                case 'seg':
                    markup += '<span class="punctuation">';
                    markup += child.firstChild.nodeValue + '</span>';
            }
            child = child.nextSibling;
        }
        return markup;
    }
    // Sequences the verse content by structure.
    function sequenceVerse(verse) {
        var lines = [], markup = '', setLine = false, type;
        var child = verse.firstChild;
        while (child) {
            if (child.nodeType === 3 && markup) { // Whitespace in the source.
                markup += '<span class="punctuation"> </span>';
            }
            switch (child.nodeName) {
                case 'w':
                    if (setLine) {
                        lines.push({"code": setLine, "markup": markup});
                        markup = '';
                        setLine = false;
                    }
                    markup += markupItem(child);
                    if (child.hasAttribute('n')) {
                        setLine = child.getAttribute('n');
                    }
                    break;
                case 'seg':
                    type = child.getAttribute('type');
                    if (type === 'x-pe' || type === 'x-samekh') {
                        markup += '<span class="mark">';
                        markup += child.firstChild.nodeValue + '</span>';
                    } else {
                        markup += '<span class="punctuation">';
                        markup += child.firstChild.nodeValue + '</span>';
                    }
                    break;
                case 'note':
                    if (child.hasAttribute('n')) { // WLC note.
                        markup += '<sup class="note" title="';
                        markup += child.firstChild.nodeValue + '">';
                        markup += child.getAttribute('n') + '</sup>';
                    } else if (child.hasAttribute('type')) {
                        type = child.getAttribute('type');
                        if (type === 'variant') { // Qere.
                            markup += markupQere(child);
                        } else if (type === 'alternative') { // Alternate accents.
                            markup += '<sup class="note" title="';
                            markup += child.getElementsByTagName('rdg')[0].firstChild.nodeValue + '">*</sup>';
                        }
                    } else {
                        markup += '<sup class="note" title="';
                        markup += child.firstChild.nodeValue + '">*</sup>';
                    }
            }
            child = child.nextSibling;
        }
        lines.push({"code": setLine, "markup": markup});
        return lines;
    }
    // Recursive function to mark up blocks.
    function markupBlock(lines, level) {
        var limit = lines.length, markup = '<span class="level' + level + '">';
        if (limit === 1) {
            return markup + lines[0].markup + '</span>';
        }
        // Recursive breakdown of blocks.
        var index = 2 * level, block = [], i = 0, test,
            code = lines[0].code.charAt(index);
        for (; i < limit; i++) {
            test = lines[i].code.charAt(index);
            if (test !== code) {
                markup += markupBlock(block, level + 1);
                block = [];
                code = test;
            }
            block.push(lines[i]);
        }
        markup += markupBlock(block, level + 1) + '</span>';
        return markup;
    }
	// Convert an osisID to a scripture reference.
	var refConvert = window.referenceConversion;
    // Marks up the verse.
    function markupVerse(verse) {
        var lines = sequenceVerse(verse),
			markup = '<h3>' + refConvert(verse.getAttribute('osisID')) + '</h3>';
        return markup + markupBlock(lines, 0);
    }
	return function(verse) {
		return markupVerse(verse);
	};
}();