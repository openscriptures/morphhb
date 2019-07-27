/**
 * @fileOverview MorphologyParser encapsulates the morphology parser for OshbRead.
 * @version 1.0
 * @author David
 */
morphologyParser = function() {
	// Summary of Hebrew morphology codes.
    var morphCodes = {
        'partOfSpeech': {
            'A': 'Adjective',
            'C': 'Conjunction',
            'D': 'Adverb',
            'N': 'Noun',
            'P': 'Pronoun',
            'R': 'Preposition',
            'S': 'Suffix',
            'T': 'Particle',
            'V': 'Verb'
        },
        'adjectiveType': {
            'a': 'adjective',
            'c': 'cardinal number',
            'g': 'gentilic',
            'o': 'ordinal number',
            'x': ''
        },
        'nounType': {
            'c': 'common',
            'g': 'gentilic',
            'p': 'proper name',
            'x': ''
        },
        'pronounType': {
            'd': 'demonstrative',
            'f': 'indefinite',
            'i': 'interrogative',
            'p': 'personal',
            'r': 'relative',
            'x': ''
        },
	'prepositionType': {
            'd': 'definite article'
	},
        'suffixType': {
            'd': 'directional he',
            'h': 'paragogic he',
            'n': 'paragogic nun',
            'p': 'pronominal',
            'x': ''
        },
        'particleType': {
            'a': 'affirmation',
            'd': 'definite article',
            'e': 'exhortation',
            'i': 'interrogative',
            'j': 'interjection',
            'm': 'demonstrative',
            'n': 'negative',
            'o': 'direct object marker',
            'p': 'definite article with inseparable preposition',
            'r': 'relative'
        },
        'verbStemHebrew': {
            'q': 'qal',
            'N': 'niphal',
            'p': 'piel',
            'P': 'pual',
            'h': 'hiphil',
            'H': 'hophal',
            't': 'hithpael',
            'o': 'polel',
            'O': 'polal',
            'r': 'hithpolel',
            'm': 'poel',
            'M': 'poal',
            'k': 'palel',
            'K': 'pulal',
            'Q': 'qal passive',
            'l': 'pilpel',
            'L': 'polpal',
            'f': 'hithpalpel',
            'D': 'nithpael',
            'j': 'pealal',
            'i': 'pilel',
            'u': 'hothpaal',
            'c': 'tiphil',
            'v': 'hishtaphel',
            'w': 'nithpalel',
            'y': 'nithpoel',
            'z': 'hithpoel',
            'x': ''
        },
        'verbStemAramaic': {
            'q': 'peal',
            'Q': 'peil',
            'u': 'hithpeel',
            'N': 'niphal',
            'p': 'pael',
            'P': 'ithpaal',
            'M': 'hithpaal',
            'a': 'aphel',
            'h': 'haphel',
            's': 'saphel',
            'e': 'shaphel',
            'H': 'hophal',
            'i': 'ithpeel',
            't': 'hishtaphel',
            'v': 'ishtaphel',
            'w': 'hithaphel',
            'o': 'polel',
            'z': 'ithpoel',
            'r': 'hithpolel',
            'f': 'hithpalpel',
            'b': 'hephal',
            'c': 'tiphel',
            'm': 'poel',
            'l': 'palpel',
            'L': 'ithpalpel',
            'O': 'ithpolel',
            'G': 'ittaphal',
            'x': ''
        },
        'verbAspect': {
            'a': 'infinitive absolute',
            'c': 'infinitive construct',
            'h': 'cohortative',
            'i': 'imperfect',
            'j': 'jussive',
            'p': 'perfect',
            'q': 'sequential perfect',
            'r': 'participle active',
            's': 'participle passive',
            'v': 'imperative',
            'w': 'sequential imperfect',
            'x': ''
        },
        'adjCase': {
            'a': 'accusative',
            'n': 'nominative',
            'x': ''
        },
        'person': {
            '1': 'first person',
            '2': 'second person',
            '3': 'third person',
            'x': ''
        },
        'gender': {
            'b': 'both',
            'c': 'common',
            'f': 'feminine',
            'm': 'masculine',
            'x': ''
        },
        'number': {
            'd': 'dual',
            'p': 'plural',
            's': 'singular',
            'x': ''
        },
        'state': {
            'a': 'absolute',
            'c': 'construct',
            'd': 'determined'
        },
        'language': {
            'H': 'Hebrew',
            'A': 'Aramaic'
        }
    };
	// Parser for morphology codes.
    var MorphParse = function() {
        var language, nextName;
        /**
         * Parses the given code.
         * @param {string} code A morph code
         * @returns (string} The morphology
         */
        this.Parse = function(code) {
            if (!code) {return {"morph": "", "next": "language", "segs": 0};}
            language = code.charAt(0);
            if (!morphCodes.language.hasOwnProperty(language)) {
                return {"morph": "Unknown language", "next": "error", "segs": 0};
            }
            var morph = morphCodes.language[language];
            code = code.substr(1);
            if (code) {
                var parts = code.split('/'), i = 1, len = parts.length;
                morph += ':<br />' + parseCode(parts[0]);
                for (; i < len; i++) {
                    morph += '<br />' + parseCode(parts[i]);
                }
            } else {
                nextName = 'partOfSpeech';
            }
            len = len ? len - 1 : 0;
            return {"morph": morph, "next": nextName, "segs": len};
        };
        // Parses the code.
        var parseCode = function(code) {
            if (!code) {
                nextName = 'partOfSpeech';
                return '';
            }
            var pos = code.charAt(0);
            if (!morphCodes.partOfSpeech.hasOwnProperty(pos)) {
                nextName = 'error';
                return "Unknown part of speech";
            }
            var morph = morphCodes.partOfSpeech[pos];
            if (code.length > 1) {
                switch (pos) {
                    case 'A':
                        morph += ' ' + parseAdjective(code);
                        break;
                    case 'C':
                        nextName = 'error';
                        morph += ' ' + "Unknown separator";
                        break;
                    case 'D':
                        nextName = 'error';
                        morph += ' ' + "Unknown separator";
                        break;
                    case 'N':
                        morph += ' ' + parseNoun(code);
                        break;
                    case 'P':
                        morph += ' ' + parsePronoun(code);
                        break;
                    case 'R':
                        morph += ' ' + parsePreposition(code);
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
            } else {
                switch (pos) {
                    case 'A':
                        nextName = 'adjectiveType';
                        break;
                    case 'C':
                        nextName = 'separator';
                        break;
                    case 'D':
                        nextName = 'separator';
                        break;
                    case 'N':
                        nextName = 'nounType';
                        break;
                    case 'P':
                        nextName = 'pronounType';
                        break;
                    case 'R':
                        nextName = 'prepositionType';
                        break;
                    case 'S':
                        nextName = 'suffixType';
                        break;
                    case 'T':
                        nextName = 'particleType';
                        break;
                    case 'V':
                        if (language === 'H') {
                            nextName = 'verbStemHebrew';
                        } else {
                            nextName = 'verbStemAramaic';
                        }
                        break;
                    default:
                        nextName = 'error';
                }
            }
            return morph;
        };
        // Parses the adjective code.
        var parseAdjective = function(code) {
            if (!morphCodes.adjectiveType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown adjective type";
            }
            var morph = morphCodes.adjectiveType[code.charAt(1)];
            if (code.length > 2) {
                morph += ' ' + parseGender(code, 2);
            } else {
                nextName = 'gender';
            }
            return morph;
        };
        // Parses the noun code.
        var parseNoun = function(code) {
            if (!morphCodes.nounType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown noun type";
            }
            var morph = morphCodes.nounType[code.charAt(1)];
            if (code.length > 2) {
                morph += ' ' + parseGender(code, 2);
            } else {
                nextName = 'gender';
            }
            return morph;
        };
        // Parses the pronoun code.
        var parsePronoun = function(code) {
            if (!morphCodes.pronounType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown pronoun type";
            }
            var morph = morphCodes.pronounType[code.charAt(1)];
            if (code.length > 2) {
                morph += ' ' + parsePerson(code, 2);
            } else {
                nextName = 'person';
            }
            return morph;
        };
        // Parse the preposition code.
        var parsePreposition = function(code) {
            if (!morphCodes.prepositionType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown preposition type";
            }
            var morph = morphCodes.prepositionType[code.charAt(1)];
            if (code.length > 2) {
                nextName = 'error';
                return "Unknown separator";
            } else {
                nextName = 'separator';
            }
            return morph;
        };
        // Parses the suffix code.
        var parseSuffix = function(code) {
            if (!morphCodes.suffixType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown suffix type";
            }
            var morph = morphCodes.suffixType[code.charAt(1)];
            if (code.length > 2) {
                morph += ' ' + parsePerson(code, 2);
            } else {
                nextName = 'person';
            }
            return morph;
        };
        // Parses the participle code.
        var parseParticle = function(code) {
            if (!morphCodes.particleType.hasOwnProperty(code.charAt(1))) {
                nextName = 'error';
                return "Unknown particle type";
            }
            var morph = morphCodes.particleType[code.charAt(1)];
            if (code.length > 2) {
                nextName = 'error';
                return "Unknown separator";
            } else {
                nextName = 'separator';
            }
            return morph;
        };
        // Parses the verb code.
        var parseVerb = function(code) {
            var morph, isMorph;
            if (language === 'H') {
                isMorph = morphCodes.verbStemHebrew.hasOwnProperty(code.charAt(1));
                morph = morphCodes.verbStemHebrew[code.charAt(1)];
            } else {
                isMorph = morphCodes.verbStemAramaic.hasOwnProperty(code.charAt(1));
                morph = morphCodes.verbStemAramaic[code.charAt(1)];
            }
            if (!isMorph) {
                nextName = 'error';
                return "Unknown verb stem";
            }
            if (code.length > 2) {
                morph += ' ' + parseAspect(code);
            } else {
                nextName = 'verbAspect';
            }
            return morph;
        };
        // Parses the aspect code.
        var parseAspect = function(code) {
            if (!morphCodes.verbAspect.hasOwnProperty(code.charAt(2))) {
                nextName = 'error';
                return "Unknown verb aspect";
            }
            var morph = morphCodes.verbAspect[code.charAt(2)];
            if (morph === 'participle active' || morph === 'participle passive') {
                if (code.length > 3) {
                    morph += ' ' + parseGender(code, 3);
                } else {
                    nextName = 'gender';
                }
            } else if (morph === 'infinitive absolute' || morph === 'infinitive construct') {
                if (code.length > 3) {
                    nextName = 'error';
                    return "Unknown field";
                } else {
                    nextName = 'separator';
                }
            } else {
                if (code.length > 3) {
                    morph += ' ' + parsePerson(code, 3);
                } else {
                    nextName = 'person';
                }
            }
            return morph;
        };
        // Parses the person code.
        var parsePerson = function(code, pos) {
            if (!morphCodes.person.hasOwnProperty(code.charAt(pos))) {
                nextName = 'error';
                return "Unknown person";
            }
            var morph = morphCodes.person[code.charAt(pos)];
            pos++;
            if (code.length > pos) {
                morph += ' ' + parseGender(code, pos);
            } else {
                nextName = 'gender';
            }
            return morph;
        };
        // Parses the gender code.
        var parseGender = function(code, pos) {
            if (!morphCodes.gender.hasOwnProperty(code.charAt(pos))) {
                nextName = 'error';
                return "Unknown gender";
            }
            var morph = morphCodes.gender[code.charAt(pos)];
            pos++;
            if (code.length > pos) {
                morph += ' ' + parseNumber(code, pos);
            } else {
                nextName = 'number';
            }
            return morph;
        };
        // Parses the number code.
        var parseNumber = function(code, pos) {
            if (!morphCodes.number.hasOwnProperty(code.charAt(pos))) {
                nextName = 'error';
                return "Unknown number";
            }
            var morph = morphCodes.number[code.charAt(pos)];
            pos++;
            if (code.length > pos) {
                    morph += ' ' + parseState(code, pos);
                } else if (code.charAt(0) === 'V') {
                    if (code.charAt(2) === 'r' || code.charAt(2) === 's') {
                            nextName = 'state';
                    } else {
                            nextName = 'separator';
                    }
                } else if (code.charAt(0) === 'P' || code.charAt(0) === 'S') {
                    nextName = 'separator';
                } else {
                    nextName = 'state';
                }
            return morph;
        };
        // Parses the state code.
        var parseState = function(code, pos) {
            if (!morphCodes.state.hasOwnProperty(code.charAt(pos))) {
                nextName = 'error';
                return "Unknown state";
            }
            var morph = morphCodes.state[code.charAt(pos)];
            pos++;
            if (code.length > pos) {
                nextName = 'error';
                return "Unknown separator";
            } else {
                nextName = 'separator';
            }
            return morph;
        };
    };
	// An instance of MorphParse.
	var parser = new MorphParse;
	// Return the public interface.
	return function(code) {
		return parser.Parse(code);
	}
}();