/**
 * @fileOverview Structure is the JavaScript controller for OSHB structure.
 * @version 1.4
 * Version 1.4: Factored in Reference Location, to link to the current verse.
 * Version 1.3: Updated for entire WLC, verse layout and depth.
 * Version 1.2: Updated for popup display.
 * @author David
 */
(function() {
    // Retains references to frequently used elements.
    var elements = {
        "book": document.getElementById('book'),
        "chapter": document.getElementById('chapter'),
        "verse": document.getElementById('verse'),
        "display": document.getElementById('display'),
        "link": document.getElementById('link'),
        "verseLayout": document.getElementById('verseLayout'),
        "levelDepth": document.getElementById('levelDepth')
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
    // Parses the XML string into a DOM document.
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
    // From https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
    function xhrSuccess() {
        this.callback.apply(this, this.arguments);
    }
    function xhrError() {
        console.error(this.statusText);
    }
    function loadFile(sURL, fCallback /*, argumentToPass1, argumentToPass2, etc. */) {
      var oReq = new XMLHttpRequest();
      oReq.callback = fCallback;
      oReq.arguments = Array.prototype.slice.call(arguments, 2);
      oReq.onload = xhrSuccess;
      oReq.onerror = xhrError;
      oReq.open("get", sURL, true);
      oReq.send(null);
    }
// Navigation elements.
    var bookText, bookIndex;
    // Sets the options for the chapter dropdown.
    var setChapters = function() {
		bookText = this.responseText;
        bookIndex = books[elements.book.value].split(' ');
        var i = 1, num = parseInt(bookIndex[0]);
        clearNodes(elements.chapter);
        for (; i <= num; i++) {
            elements.chapter.options[elements.chapter.options.length] = new Option(i);
        }
        elements.chapter[initialChapter].selected = "selected";
        initialChapter = 0;
        setChapterFile();
    };
    // Sets the options for the verse dropdown.
    var setVerses = function() {
        var i = 1, num = bookIndex[elements.chapter.value];
        clearNodes(elements.verse);
        for (; i <= num; i++) {
            elements.verse.options[elements.verse.options.length] = new Option(i);
        }
        elements.verse[initialVerse].selected = "selected";
        initialVerse = 0;
        getVerse();
    };
    // Extracts the XML chapter from bookText.
    var setChapterFile = function() {
		var xmlString = '<?xml version="1.0" encoding="UTF-8"?>',
			osisID = elements.book.value + "." + elements.chapter.value,
			start = bookText.indexOf('<chapter osisID="' + osisID + '"'),
			end = bookText.indexOf('</chapter>', start) + 10;
		xmlString += bookText.substring(start, end);
		chapterXml = parseXmlString(xmlString);
		setVerses();
    };
	// Sets the XML book file to read.
	var setBookFile = function() {
        var book = elements.book.value;
        return loadFile("../../wlc/" + book + ".xml", setChapters);
	};
// Interface elements.
    // Marks up the link.
	function linkMark() {
		var address = refLocation.getLocation(elements.book.value, elements.chapter.value, elements.verse.value);
		return '<a href="' + address + '">' + address + '</a>'
	}
    // Marks up the verse.
    // Interprets the accents.
    var accentInterpretation = window.accentInterpretation;
    // Gets the selected verse.
    function getVerse() {
        var index = elements.verse.value - 1;
        var verse = chapterXml.getElementsByTagName('verse')[index];
        // Set the scope based on the verse ID.
        accentInterpretation.setAccents(verse.getAttribute('osisID'));
        clearNodes(elements.display);
        if (elements.verseLayout.value.indexOf("-bt") > -1) {
            elements.display.appendChild(markupVerse(verse, true));
        } else {
            elements.display.appendChild(markupVerse(verse, false));
        }
        setLevelDepth();
		// Set the link.
		elements.link.innerHTML = linkMark();
    }
    // Gets the selected verse layout stylesheet.
    function getVerseLayout() {
        var layoutDir, i, link_tag;
        if (elements.verseLayout.value.startsWith("horizontal")) {
            layoutDir = "horizontal";
            markupVerse = window.verseMarkupHorizontal;
        } else {
            layoutDir = "vertical";
            markupVerse = window.verseMarkupVertical;
        }
        // Adapted from https://www.thesitewizard.com/javascripts/change-style-sheets.shtml
        var i, link_tag ;
        for (i = 0, link_tag = document.getElementsByTagName('link') ;
            i < link_tag.length ; i++ ) {
            if ((link_tag[i].rel.indexOf('stylesheet') != -1) && link_tag[i].title) {
                link_tag[i].disabled = true ;
                if (link_tag[i].title == layoutDir) {
                    link_tag[i].disabled = false ;
                }
            }
        }
        getVerse();
    }
    // Sets the visibility of the accents level up to depth.
    function setLevelDepth() {
        var i, depth = parseInt(elements.levelDepth.value);
        if (depth < 0 || depth > 5) {
            return;
        }
        for (i = 0; i <= depth; i++) {
            var toShow = elements.display.getElementsByClassName("level" + i);
            for (var j = 0; j < toShow.length; j++) {
                toShow[j].style.removeProperty("border-style");
            };
        }
        for (i = depth + 1; i <= 5; i++) {
            var toHide = elements.display.getElementsByClassName("level" + i);
            for (var j = 0; j < toHide.length; j++) {
                toHide[j].style.borderStyle = "hidden";
            }
        }
    }
    // Initialize.
    var refLocation = window.refLocation,
		initialChapter = refLocation.chapterIndex(),
		initialVerse = refLocation.verseIndex();
    var markupVerse = window.verseMarkupHorizontal;
    elements.book.onchange = setBookFile;
    elements.chapter.onchange = setChapterFile;
    elements.verse.onchange = getVerse;
    elements.verseLayout.onchange = getVerseLayout;
    elements.levelDepth.onchange = setLevelDepth;
    setBookFile();
})();
