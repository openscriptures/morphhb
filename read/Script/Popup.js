/**
 * @fileOverview Popup is a markup component for OshbRead.
 * @version 1.0
 * @author David
 */
popup = function() {
    // Interprets the accents.
    var accentInterpretation = window.accentInterpretation;
	var display = document.getElementById('display'),
		pop = document.createElement('div');
	pop.id = 'popup';
	document.getElementById('work').appendChild(pop);
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
	// Shows the popup.
	function showPopup(data) {
		var markup = "<ul>";
		markup += "<li class='lemma'>" + data.lemma + "</li>";
		markup += "<li class='morph'>" + data.morph + "</li>";
		markup += "<li class='accent'>" + accentInterpretation.interpret(data.accents, data.form, data.accentType) + "</li>";
		markup += "</ul>";
		pop.innerHTML = markup;
		var pos = position(data.node);
		pop.style.top = pos.top + data.node.offsetHeight - display.scrollTop + 'px';
		pop.style.left = pos.left + 'px';
		pop.style.display = 'block';
	}
	// Hides the popup.
	function hidePopup() {
		pop.style.display = 'none';
	}
	return {
		show: function(data) {
			showPopup(data);
		},
		hide: function() {
			hidePopup();
		}
	};
}();