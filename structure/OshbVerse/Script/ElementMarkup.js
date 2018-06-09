/**
 * @fileOverview ElementMarkup is a markup component for OshbVerse.
 * @version 1.0
 * @author David
 */
elementMarkup = function() {
	popup = window.popup;
	// Constructs the element for a seg.
	function segElement(className, content) {
		var span = document.createElement('span');
		span.className = className;
		span.appendChild(document.createTextNode(content));
		return span;
	}
	// Constructs the element for a note.
	function supElement(className, title, content) {
		var sup = document.createElement('sup');
		sup.className = className;
		sup.title = title;
		sup.appendChild(document.createTextNode(content));
		return sup;
	}
	// Constructs the element for a word.
	function wordElement(word) {
		var span = document.createElement('span');
		span.className = "Hebrew";
		// Content for the span. (11 instances of large, small or suspended letters.)
		var child = word.firstChild;
		while (child) {
			if (child.nodeType === 3) {
				span.appendChild(document.createTextNode(child.nodeValue));
			} else {
				span.appendChild(segElement(child.getAttribute('type'), child.firstChild.nodeValue));
			}
			child = child.nextSibling;
		}
		return span;
	}
	// Maintains the word data while setting up the handlers.
	var wordData = function() {
		var data = {};
		// Sets the word data.
		function setData(word) {
			data = {};
			data.node = wordElement(word);
			data.lemma = word.getAttribute('lemma');
			data.morph = word.hasAttribute('morph') ? word.getAttribute('morph') : "";
			data.accents = data.node.textContent.replace(/[\u05AF-\u05F4\/]/g, "");
			return data.node;
		}
		// Event handlers for the word.
		function handlers(isDisjunctive) {
			data.accentType = isDisjunctive ? "disjunctive" : "conjunctive";
			// Bypass the closure.
			(function(thisData) {
				data.node.onmouseover = function() {
					popup.show(thisData);
				};
				data.node.onmouseout = popup.hide;
			})(data);
		}
		return {
			element: function(word) {
				return setData(word);
			},
			addAccent: function(accent) {
				data.accents += accent;
			},
			setHandlers: function(isDisjunctive) {
				handlers(isDisjunctive);
			}
		};
	}();
	// Constructs the element for a qere note.
	function qereElement(qere) {
		var child = qere.getElementsByTagName('rdg')[0].firstChild,
			span = document.createElement('span'), setLine = false;
		span.className = "qere";
		span.title = "qere";
		span.appendChild(segElement("punctuation", "\u00A0"));
		while (child) {
			if (child.nodeType === 3) {
				span.appendChild(segElement("punctuation", "\u00A0"));
			}
			switch (child.nodeName) {
				case 'w':
					span.appendChild(wordData.element(child));
					if (child.hasAttribute('n')) {
						setLine = child.getAttribute('n');
					} else {
						wordData.setHandlers();
					}
					break;
				case 'seg':
					span.appendChild(segElement("punctuation", child.firstChild.nodeValue));
					if (setLine) {
						wordData.addAccent(child.firstChild.nodeValue);
					}
			}
			child = child.nextSibling;
		}
		return {span: span, setLine: setLine};
	}
    // Breaks the verse content into lines by structure.
	function verseLines(verse) {
		var lines = [], currentLine = document.createElement('div'),
			setLine = false, type, child = verse.firstChild;
		while (child) {
			if (child.nodeType === 3 && currentLine.hasChildNodes()) {
				currentLine.appendChild(segElement("punctuation", "\u00A0"));
			}
			switch (child.nodeName) {
				case 'w':
					if (setLine) {
						wordData.setHandlers(true);
						lines.push({"code": setLine, "line": currentLine});
						currentLine = document.createElement('div');
						setLine = false;
					}
					currentLine.appendChild(wordData.element(child));
					if (child.hasAttribute('n')) {
						setLine = child.getAttribute('n');
					} else {
						wordData.setHandlers();
					}
					break;
				case 'seg':
					type = child.getAttribute('type');
					if (type === 'x-pe' || type === 'x-samekh') {
						currentLine.appendChild(segElement("mark", child.firstChild.nodeValue));
					} else {
						currentLine.appendChild(segElement("punctuation", child.firstChild.nodeValue));
						if (setLine) {
							wordData.addAccent(child.firstChild.nodeValue);
						}
					}
					break;
				case 'note':
					if (child.hasAttribute('n')) {
						currentLine.appendChild(supElement("note", child.firstChild.nodeValue, child.getAttribute('n')));
					} else if (child.hasAttribute('type')) {
						type = child.getAttribute('type');
						if (type === 'variant') {
							currentLine.appendChild(segElement("punctuation", " "));
							var qereOutput = qereElement(child);
							currentLine.appendChild(qereOutput.span);
							setLine = qereOutput.setLine ? qereOutput.setLine : setLine;
						} else if (type === 'alternative') {
							currentLine.appendChild(supElement("note", "alternative: " + child.getElementsByTagName('rdg')[0].firstChild.nodeValue, "*"));
						}
					} else {
						currentLine.appendChild(supElement("note", "alternative: " + child.firstChild.nodeValue, "*"));
					}
			}
			child = child.nextSibling;
		}
		wordData.setHandlers(true);
		lines.push({"code": setLine, "line": currentLine});
		return lines;
	}
	// Return the array of marked up lines.
	return function(verse) {
		return verseLines(verse);
	};
}();