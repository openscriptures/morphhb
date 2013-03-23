ParsingApp contains the initial PHP application for parsing the OSHB.

You can prepare the application for running by opening up
ChapterMarkup.php, and changing 'user' and 'password' on line 48 to
contain the actual username and password for the database connection.

The application can be installed on a local server, maintaining the
internal directory structure.

Running the application should present you with the startup screen.
Changing the chapter number will load the selected book and chapter,
or you can use the Select button to get the current selection.

Once a chapter is loaded, the parsing interface will appear, and you
can start parsing.  When you apply a parsing, it will be added to the
title of the given word, so it can be viewed by hovering on the word.

For testing purposes, the Save button will send the changes you made to
the morphology back to the server.  In response, all you will get is an
alert listing the changes.  Nothing is being saved to the database yet.