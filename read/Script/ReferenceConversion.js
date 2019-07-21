/**
 * @fileOverview ReferenceConversion converts an osisID to a scripture reference.
 * @version 1.0
 * @author David
 */
referenceConversion = function() {
	var bookNames = {
		"Gen": "Genesis", "Exod": "Exodus", "Lev": "Leviticus", "Num": "Numbers", "Deut": "Deuteronomy",
		"Josh": "Joshua", "Judg": "Judges", "1Sam": "1 Samuel", "2Sam": "2 Samuel", "1Kgs": "1 Kings",
		"2Kgs": "2 Kings", "Isa": "Isaiah", "Jer": "Jeremiah", "Ezek": "Ezekiel", "Hos": "Hosea",
		"Joel": "Joel", "Amos": "Amos", "Obad": "Obadiah", "Jonah": "Jonah", "Mic": "Micah",
		"Nah": "Nahum", "Hab": "Habakkuk", "Zeph": "Zephaniah", "Hag": "Haggai", "Zech": "Zechariah",
		"Mal": "Malachi", "Ps": "Psalm", "Prov": "Proverbs", "Job": "Job", "Song": "Song of Songs",
		"Ruth": "Ruth", "Lam": "Lamentations", "Eccl": "Ecclesiastes", "Esth": "Esther", "Dan": "Daniel",
		"Ezra": "Ezra", "Neh": "Nehemiah", "1Chr": "1 Chronicles", "2Chr": "2 Chronicles"
	};
	// Convert the osisID to a scripture reference.
	function convert(id) {
		var fields = id.split(".");
		switch (fields.length) {
			case 1:
				return bookNames[fields[0]];
			case 2:
				return bookNames[fields[0]] + " " + fields[1];
			case 3:
				return  bookNames[fields[0]] + " " + fields[1] + ":" + fields[2];
			default:
				return false;
		}
	}
	return function(id) {
		return convert(id);
	};
}();