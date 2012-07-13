MorphParse is a test application for the morphology parser.

MorphParse.js is the heart of the parser, depending on
MorphCodes.js.  It has one public method: Parse.  Simply
instantiate the class:
	var parser = new MorphParse();
and call:
	parser.Parse(code);

Gen1MorphL.xml is a sample morphology file.

The rest of the files are scaffolding for the test application.

The entire application is released under the
Creative Commons Attribution-ShareAlike license:
http://creativecommons.org/licenses/by-sa/3.0/