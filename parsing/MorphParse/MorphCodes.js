/**
 * @fileOverview MorphCodes is a summary of Hebrew morphology codes.
 * @version 1.2
 * @author David
 */
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
	'conjunctionType': {
		'c': 'conjunctive',
		'v': 'vav consecutive'
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
}