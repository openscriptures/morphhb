/**
 * @fileOverview Reference Location manages URL locations.
 * @version 1.0
 * @author David
 */
refLocation = function() {
	// Assemble an array of SBL book abbreviations.
	var book = document.getElementById("book"),
		sblNames = [], i = 0;
	while (book.options[i]) {
		sblNames.push(book.options[i].value);
		i++;
	}
	// Parses the URL.
	function parseURL() {
		var parts = {book: "Gen", chapter: 1, verse: 1},
			url = window.location,
			results;
		if (url.length > 75) {return parts;} // Excessively long URL.
		results = url.search.match(/b=(\w+)/);
		if (results && results[1]) {
			if (sblNames.indexOf(results[1]) >= 0) {
				parts.book = results[1];
			} else {
				mtNum = parseInt(results[1]);
				if (mtNum > 0 && mtNum < 40) {
					parts.book = sblNames[mtNum - 1];
				} else {
					return parts; // Unknown book number.
				}
			}
		} else {
			return parts; // Unknown book abbreviation.
		}
		results = url.search.match(/c=(\d+)/);
		if (results) {parts.chapter = parseInt(results[1]);}
		results = url.search.match(/v=(\d+)/);
		if (results) {parts.verse = parseInt(results[1]);}
		return parts;
	}
	// Apply the results.
	var ref = parseURL(),
		homePage = window.location.protocol + "//" + window.location.host + "/read/index.html";
	book[sblNames.indexOf(ref.book)].selected = "selected";
	// Return the public interface.
	return {
		chapterIndex: function() {
			return ref.chapter - 1;
		},
		verseIndex: function() {
			return ref.verse - 1;
		},
		getLocation: function(sblBook, chapter, verse) {
			return homePage + "?b=" + sblBook + "&c=" + chapter + "&v=" + verse;
		}
	}
}();