/**
 * @fileOverview AccentInterpretation is a component for OshbRead,
 * to interpret cantillation marks.
 * @version 1.1 Refactored for chapter markup.
 * @version 1.0
 * @author David
 */
accentInterpretation = function() {
	var accentCatalog = window.accentCatalog;
	// Set the scope.
	function setScope(osisID) {
		var fields = osisID.split(".");
		switch (fields[0]) {
			case "Ps":
			case "Prov":
				return "poetic";
			case "Job":
				if (fields[1] < 3 || (fields[1] == 42 && fields[2] > 6) || osisID == "Job.3.1") {
					return "prose";
				} else {
					return "poetic";
				}
				break;
			default:
				return "prose";
		}
	}
	// Interprets the accents.
	function interpretAccents(accentString, accentForm, accentType) {
		var accent = accentCatalog[accentForm][accentType][accentString];
		return accent ? accent.name : "error|" + accentString + "|" + accentType;
	}
	return {
		getForm: function(osisID) {
			return setScope(osisID);
		},
		interpret: function(accentString, accentForm, accentType) {
			return interpretAccents(accentString, accentForm, accentType);
		}
	};
}();