/**
 * @fileOverview VerseMarkupVertical is a markup component for OshbVerse.
 * Components can be merged into one script for efficiency and global scope purity,
 * in production. This component can be interchanged with VerseMarkupHorizontal
 * for alternate display, with the appropriate Passage styles.
 * @version 1.0
 * @author David
 */
verseMarkup = function() {
    // Constructs the markup for a qere note.
    function markupQere(qere) {
        var child = qere.getElementsByTagName('rdg')[0].firstChild,
            markup = ' <span class="qere">';
        while (child) {
            if (child.nodeType === 3) { // Whitespace in the source.
                markup += '<span class="punctuation"> </span>';
            }
            switch (child.nodeName) {
                case 'w':
                    markup += '<span class="Hebrew" title="';
                    markup += child.getAttribute('lemma') + '">';
                    markup += child.firstChild.nodeValue + '</span>';
                    break;
                case 'seg':
                    markup += '<span class="punctuation">';
                    markup += child.firstChild.nodeValue + '</span>';
            }
            child = child.nextSibling;
        }
        markup += '</span>';
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
                    markup += '<span class="Hebrew" title="';
                    markup += child.getAttribute('lemma') + '">';
                    markup += child.firstChild.nodeValue + '</span>';
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
                    if (child.hasAttribute('n')) {
                        markup += '<sup class="note" title="';
                        markup += child.firstChild.nodeValue + '">';
                        markup += child.getAttribute('n') + '</sup>';
                    } else if (child.hasAttribute('type')) {
                        type = child.getAttribute('type');
                        if (type === 'variant') {
                            markup += markupQere(child);
                        } else if (type === 'alternative') {
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
        var limit = lines.length, markup = '<div class="level' + level + '">';
        if (limit === 1) {
            return markup + lines[0].markup + '</div>';
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
        markup += markupBlock(block, level + 1) + '</div>';
        return markup;
    }
    // Marks up the verse.
    function markupVerse(verse) {
        var lines = sequenceVerse(verse);
        var markup = '<h3>' + verse.getAttribute('osisID') + '</h3>';
        return markup + markupBlock(lines, 0);
    }
	return function(verse) {
		return markupVerse(verse);
	};
}();