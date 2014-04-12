/**
 * @fileOverview Structure is the JavaScript controller for OSHB structure.
 * @version 1.0
 * @author David
 */
(function() {
    // Retains references to frequently used elements.
    var elements = {
        "book": document.getElementById('book'),
        "chapter": document.getElementById('chapter'),
        "verse": document.getElementById('verse'),
        "display": document.getElementById('display'),
    };
// Utility functions.
    // Utility function to clear child nodes from an element.
    var clearNodes = function(elem) {
        while (elem.childNodes.length > 0) {
            elem.removeChild(elem.firstChild);
        }
    };
// XML handling.
    var chapterXml;
    // Parses the XML string into an DOM document.
    var parseXmlString = function(xml) {
        if (window.DOMParser)
        {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(xml, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(xml);
        }
        return xmlDoc;
    };
// Navigation elements.
    var bookIndex;
    // Sets the options for the chapter dropdown.
    var setChapters = function() {
        bookIndex = books[elements.book.value].split(' ');
        var i = 1, num = parseInt(bookIndex[0]);
        clearNodes(elements.chapter);
        for (; i <= num; i++) {
            elements.chapter.options[elements.chapter.options.length] = new Option(i);
        }
        elements.chapter[initialChapter].selected = "selected";
        initialChapter = 0;
        setVerses();
    };
    // Sets the test file for the demo.
    var setFile = function() {
        var book = elements.book.value;
        var chapter = elements.chapter.value;
        if (book === 'Gen') {
            switch (chapter) {
                case '1':
                    return chapter0;
                case '8':
                    return chapter1;
                case '32':
                    return chapter2;
            }
        } else if (book === 'Ps' && chapter === '1') {
            return chapter3;
        }
        return chapter0;
    };
    // Sets the options for the verse dropdown.
    var setVerses = function() {
        chapterXml = parseXmlString(setFile());
        var i = 1, num = bookIndex[elements.chapter.value];
        clearNodes(elements.verse);
        for (; i <= num; i++) {
            elements.verse.options[elements.verse.options.length] = new Option(i);
        }
        getVerse();
    };
    // Constructs the markup for a qere note.
    var markupQere = function(qere) {
        var child = qere.getElementsByTagName('rdg')[0].firstChild,
            markup = ' <span class="qere">';
        while (child) {
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
    };
    // Sequences the verse content by structure.
    var sequenceVerse = function(verse) {
        var lines = [], markup = '', setLine = false, type;
        var child = verse.firstChild;
        while (child) {
            if (child.nodeType === 3 && markup) {
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
    };
    // Recursive function to mark up blocks.
    var markupBlock = function(lines, level) {
        var limit = lines.length, markup = '<div class="level' + level + '">';
        if (limit === 1) {
            return markup + lines[0]['markup'] + '</div>';
        }
        // Recursive breakdown of blocks.
        var index = 2 * level, block = [], i = 0, test,
            code = lines[0]['code'].charAt(index);
        for (; i < limit; i++) {
            test = lines[i]['code'].charAt(index);
            if (test !== code) {
                markup += markupBlock(block, level + 1);
                block = [];
                code = test;
            }
            block.push(lines[i]);
        }
        markup += markupBlock(block, level + 1) + '</div>';
        return markup;
    };
    // Marks up the verse.
    var markupVerse = function(verse) {
        var lines = sequenceVerse(verse);
        var markup = '<h3>' + verse.getAttribute('osisID') + '</h3>';
        return markup + markupBlock(lines, 0);
    };
    // Gets the selected verse.
    var getVerse = function() {
        var index = elements.verse.value - 1;
        var verse = chapterXml.getElementsByTagName('verse')[index];
        elements.display.innerHTML = markupVerse(verse);
    };
    // Initialize.
    var initialChapter = elements.chapter.value - 1;
    elements.book.onchange = setChapters;
    elements.chapter.onchange = setVerses;
    elements.verse.onchange = getVerse;
    setChapters();
})();