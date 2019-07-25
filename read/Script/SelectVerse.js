/**
 * @fileOverview SelectVerse is an interface component for OshbRead.
 * @version 1.0
 * @author David
 */
selectVerse = function() {
    // Interprets the accents.
    var accentInterpretation = window.accentInterpretation;
	var display = document.getElementById('display');
    // Utility to find the position of an element.
    function position(element) {
        var pos = {top: 0, left: 0};
        while (element) {
            pos.top += element.offsetTop;
            pos.left += element.offsetLeft;  
            element = element.offsetParent;
        }
        return pos;
    }
	// Scroll the node into view.
	var scrollToVerse = function(node) {
		display.scrollTop = position(node).top - position(display).top - 64;
	};
	// Maintains the selected verse.
	var selectedVerse = function() {
		var currentNode = null;
		return function(node) {
			if (currentNode) {
				currentNode.className = node.className.replace(' selectedVerse', '');
			}
			currentNode = node;
			//TODO Scroll to verse.
			scrollToVerse(node);
			node.className += " selectedVerse";
		};
	}();
	return function(node) {
		selectedVerse(node);
	}
}();