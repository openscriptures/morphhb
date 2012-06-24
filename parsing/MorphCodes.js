/**
 * @fileOverview MorphCodes is a summary of Hebrew morphology codes.
 * @version 1.1
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
	'verbStem': {
		'qa': 'qal',
		'ni': 'niphal',
		'pi': 'piel',
		'pu': 'pual',
		'hi': 'hiphil',
		'ho': 'hophal',
		'ht': 'hithpael',
		'po': 'polel',
		'pp': 'pilpel',
		'hl': 'hitpolel',
		'pe': 'peal',
		'pl': 'peil',
		'he': 'hitpeel',
		'pa': 'pael',
		'hh': 'haphel',
		'ha': 'hitpaal',
		'hu': 'huphal',
		'sh': 'shaphel',
		'ap': 'aphel',
		'hp': 'hitpalpel',
		'nt': 'nitpael',
		'is': 'ishtaphal',
		'hs': 'hishtaphal',
		'ia': 'itpaal',
		'yi': 'yiphil',
		'hx': 'hitpalel',
		'ie': 'itpeel',
		'ea': 'etpaal',
		'ee': 'etpeel',
		'xx': ''
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
	}
}