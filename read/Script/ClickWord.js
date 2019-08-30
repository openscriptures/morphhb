/**
 * @fileOverview ClickWord is the click handler for words in OshbRead.
 * @version 1.0
 * @author David
 */
clickWord = function() {
	var morphologyParser = window.morphologyParser,
		morphDisplay = document.getElementById("morphDisplay");
	// Maintains the selected word.
	var selectedWord = function() {
		var currentNode = null;
		return function(node) {
			if (currentNode) {
				currentNode.className = node.className.replace(' selectedWord', '');
			}
			currentNode = node;
			node.className += " selectedWord";
		};
	}();
	// Shows the morphology display.
	function showMorphology(data) {
		var parsing = morphologyParser(data.lang + data.morph);
		morphDisplay.innerHTML = "<p>" + parsing.morph + "</p>";
		morphDisplay.style.display = 'block';
		selectedWord(data.node);
	}
	// Hides the morphology display.
	function hideMorphology() {
		morphDisplay.style.display = 'none';
	}
	// Return the public interface.
	return {
		show: function(data) {
			showMorphology(data);
		},
		hide: function() {
			hideMorphology();
		}
	};
}();