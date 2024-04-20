/**
 * @fileOverview Read is the JavaScript controller for OSHB Read.
 * @version 1.1
 * Version 1.1: Factored in Reference Location, to link to the current verse (marcstober).
 * @author David
 */
(function() {
    // Retains references to frequently used elements.
    var elements = {
        "book": document.getElementById('book'),
        "chapter": document.getElementById('chapter'),
        "verse": document.getElementById('verse'),
        "display": document.getElementById('display'),
        "link": document.getElementById('link')
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
    var bookText, bookIndex,
		clickWord = window.clickWord;
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
        getChapter();
    };
    // Extracts the XML chapter from bookText.
    var setChapterFile = function() {
		var xmlString = '<?xml version="1.0" encoding="UTF-8"?>',
			osisID = elements.book.value + "." + elements.chapter.value,
			start = bookText.indexOf('<chapter osisID="' + osisID + '"'),
			end = bookText.indexOf('</chapter>', start) + 10;
		xmlString += bookText.substring(start, end);
		chapterXml = parseXmlString(xmlString);
		clickWord.hide();
		setVerses();
    };
	// Sets the XML book file to read.
	var setBookFile = function() {
        var book = elements.book.value;
        return loadFile("../wlc/" + book + ".xml", setChapters);
	};
// Interface elements.
    // Marks up the link.
	function linkMark() {
		var address = refLocation.getLocation(elements.book.value, elements.chapter.value, elements.verse.value);
		return '<a href="' + address + '">' + address + '</a>'
	}
	var chapterMarkup = window.chapterMarkup;
    // Marks up the chapter.
	function getChapter() {
        var chapter = chapterXml.getElementsByTagName('chapter')[0];
        clearNodes(elements.display);
		elements.display.appendChild(chapterMarkup(chapter));
		// Highlight the selected verse.
		selectVerse(document.getElementById("v." + elements.verse.value));
        elements.link.innerHTML = linkMark();
	}
    // Initialize.
    var refLocation = window.refLocation,
		initialChapter = refLocation.chapterIndex(),
		initialVerse = refLocation.verseIndex(),
		selectVerse = window.selectVerse;
    elements.book.onchange = setBookFile;
    elements.chapter.onchange = setChapterFile;
    elements.verse.onchange = function() {
		selectVerse(document.getElementById("v." + elements.verse.value));
        elements.link.innerHTML = linkMark();
	};
    setBookFile();
})();