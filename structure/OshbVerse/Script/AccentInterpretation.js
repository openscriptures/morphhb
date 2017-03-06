/**
 * @fileOverview AccentInterpretation is a component for OshbVerse,
 * to interpret cantillation marks.
 * @version 1.0
 * @author David
 */
accentInterpretation = function() {
	var accentCatalog = window.accentCatalog,
		accents = accentCatalog.prose;
	// Set the scope.
	function setScope(osisID) {
		var fields = osisID.split(".");
		switch (fields[0]) {
			case "Ps":
			case "Prov":
				return accentCatalog.poetic;
			case "Job":
				if (fields[1] < 3 || (fields[1] == 42 && fields[2] > 6) || osisID == "Job.3.1") {
					return accentCatalog.prose;
				} else {
					return accentCatalog.poetic;
				}
				break;
			default:
				return accentCatalog.prose;
		}
	}
	// Interprets the accents.
	function interpretAccents(accentString, accentType) {
		return accents[accentType][accentString] ? accents[accentType][accentString].name : "error|" + accentString + "|" + accentType;
	}
	return {
		setAccents: function(osisID) {
			accents = setScope(osisID);
		},
		interpret: function(accentString, accentType) {
			return interpretAccents(accentString, accentType);
		}
	};
}();