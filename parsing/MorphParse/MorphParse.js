/**
 * @fileOverview MorphParse is a parser for morphology codes,
 * based on MorphCodes.js.
 * @version 1.2
 * @author David
 */
var MorphParse = function()
{
	var language;
    /**
     * Parses the given code.
     * @param {string} code A morph code
     * @returns (string} The morphology
     */
    this.Parse = function(code)
    {
		language = code.charAt(0);
		code = code.substr(1);
        var parts = code.split('/');
        var morph = parseCode(parts[0]);
        for (var i = 1; i < parts.length; i++) {
            morph += ', ' + parseCode(parts[i]);
        }
        return morph;
    };

    var parseCode = function(code)
    {
        var pos = code.charAt(0);
        var morph = morphCodes.partOfSpeech[pos];
        if (code.length > 1) {
            switch (pos) {
                case 'A':
                    morph += ' ' + parseAdjective(code);
                    break;
                case 'C':
                    morph += ' ' + parseConjunction(code);
                    break;
                case 'N':
                    morph += ' ' + parseNoun(code);
                    break;
                case 'P':
                    morph += ' ' + parsePronoun(code);
                    break;
                case 'S':
                    morph += ' ' + parseSuffix(code);
                    break;
                case 'T':
                    morph += ' ' + parseParticle(code);
                    break;
                case 'V':
                    morph += ' ' + parseVerb(code);
                    break;
                default:
                    morph += ' Unknown part of speech in ' + code;
            }
        }
        return morph;
    };

    var parseAdjective = function(code)
    {
        var morph = morphCodes.adjectiveType[code.charAt(1)];
        if (code.length > 2) {
            morph += ' ' + parseGender(code, 2);
        }
        return morph;
    };

    var parseConjunction = function(code)
    {
        var morph = morphCodes.conjunctionType[code.charAt(1)];
        return morph;
    };

    var parseNoun = function(code)
    {
        var morph = morphCodes.nounType[code.charAt(1)];
        if (code.length > 2) {
            morph += ' ' + parseGender(code, 2);
        }
        return morph;
    };

    var parsePronoun = function(code)
    {
        var morph = morphCodes.pronounType[code.charAt(1)];
        if (code.length > 2) {
            morph += ' ' + parseCase(code);
        }
        return morph;
    };

    var parseSuffix = function(code)
    {
        var morph = morphCodes.suffixType[code.charAt(1)];
        if (code.length > 2) {
            morph += ' ' + parsePerson(code, 2);
        }
        return morph;
    };

    var parseParticle = function(code)
    {
        var morph = morphCodes.particleType[code.charAt(1)];
        return morph;
    };

    var parseVerb = function(code)
    {
        var morph;
		if (language === 'H') {
			morph = morphCodes.verbStemHebrew[code.charAt(1)];
		} else {
			morph = morphCodes.verbStemAramaic[code.charAt(1)];
		}
        if (code.length > 2) {
            morph += ' ' + parseAspect(code);
        }
        return morph;
    };

    var parseAspect = function(code)
    {
        var morph = morphCodes.verbAspect[code.charAt(2)];
        if (code.length > 3) {
            morph += ' ' + parsePerson(code, 3);
        }
        return morph;
    };

    var parseCase = function(code)
    {
        var morph = morphCodes.adjCase[code.charAt(2)];
        if (code.length > 3) {
            morph += ' ' + parsePerson(code, 3);
        }
        return morph;
    };

    var parsePerson = function(code, pos)
    {
        var morph = morphCodes.person[code.charAt(pos)];
        pos++;
        if (code.length > pos) {
            morph += ' ' + parseGender(code, pos);
        }
        return morph;
    };

    var parseGender = function(code, pos)
    {
        var morph = morphCodes.gender[code.charAt(pos)];
        pos++;
        if (code.length > pos) {
            morph += ' ' + parseNumber(code, pos);
        }
        return morph;
    };

    var parseNumber = function(code, pos)
    {
        var morph = morphCodes.number[code.charAt(pos)];
        pos++;
        if (code.length > pos) {
            morph += ' ' + parseState(code, pos);
        }
        return morph;
    };

    var parseState = function(code, pos)
    {
        var morph = morphCodes.state[code.charAt(pos)];
        return morph;
    };
};