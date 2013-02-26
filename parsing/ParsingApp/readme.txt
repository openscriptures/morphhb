ParsingApp contains the initial PHP application for parsing the OSHB.

You can prepare the application for running by opening up OshbPath.php,
and changing the private variable $wlc to contain the path to your
local WLC directory, containing the OSHB OSIS files.  (They can be
downloaded here: https://github.com/openscriptures/morphhb)

The application can be installed on a local server, with the file
OshbPath.php outside the directory containing index.php, and
maintianing the internal directory structure.

Running the application should present you with the startup screen.
Changing the chapter number will load the selected book and chapter,
or you can use the Select button to get the current selection.

Once a chapter is loaded, the parsing interface will appear, and you
can start parsing.  When you apply a parsing, it will be added to the
title of the given word, so it can be viewed by hovering on the word.