# Parsing

- App Code Moved, see https://github.com/openscriptures/morphhb-parsing for the latest code.
-	HebrewMorphologyCodes.html is our summary of the codes used for parsing the OSHB text.
-	Oshm.xml is a TEI key file for the morphology codes used.

## Phase 1 Parsing

### Approaching a chapter

After running an auto-parsing script (program) that looks at existing parsings and guesses at those not yet parsed, all chapters in the Hebrew Bible have 50%-80% of the words already parsed. Our task now is to complete these chapters, book by book.

As you parse, note that there are three types of words: verified, done and those yet to be parsed. Please skip the green verified words. As for the brown done words, please review these. They are possibly not marked verified because the auto-parsing script guessed wrongly (eg. a 3fs imperfect might be parsed as a 2ms, or a construct might be parsed as absolute). Please add your parsing to correct these when relevant. This will not immediately mark this word as verified, but will do so the next time we run the auto-parsing script over the data.

Finally, the words without highlighting are yet to be parsed. Please parse these the best you are able, only skipping words which you have no idea how to parse.

### Parsing principles

Please parse in line with the following principles that we have landed upon as a team. For more details, see the [unfoldingWord Hebrew Grammar](http://uhg.readthedocs.io/en/latest/) being written in conjunction with these parsings.

1. Nouns and cardinal numbers that can be both feminine and masculine should be parsed as both, unless the context demands a specific gender.
2. All names of peoples (tribes, nations, clans, etc) should be parsed as Noun-gentilic (with the rest of the parsing indicated according to the specific word.)
3. The number of morphological parts must match the number of word parts. (i.e. they should both have the same number of slashes)
4. Make sure you complete all the parsing information for each word. The only exceptions to this are proper names (which only need &lsquo;Np&rsquo;), prepositions without the definite article, and paragogic and directional suffixes.
5. Parsings should not contain an x in the middle, except for non-personal pronouns (demonstrative, interrogative, indefinite and relative) which do not have a person.

### Advanced parsing principles (for editors)

If you do not have editor status in the parsing widget and would like to help with verification, please contact Jesse.

1. For qere/ketiv, these words are often not able to be verified by the etcbc. The fact that they are marked conflict does not mean there is necessarily an issue. Double check them and verify if they look right.
2. Certain words are confirmed but not verified simply because their grammatical specificity is not in the etcbc (i.e. numbers, jussives/cohortatives vs imperfects, perfect vs sequential-imperfect). Double check such words and verify if they look right.
3. The parsing has been removed from words where the parsing was determined to be impossible. Often, this is due to the wrong number of parsing parts (number of word parts must match the number of parsing parts) or it being marked gender-both when it is not on the gender-both list. (By the way, if a word is not on the gender-both list but should be, confer with Joel and Andy via slack.) In such cases, add the correct parsing and verify.
4. Many nouns are marked conflict simply because they should be construct instead of absolute, or vice versa. Again, you can add the correct parsing and verify.
5. For words marked conflict, only verify the current form if it is something mentioned in the &quot;Principles on specific words...&quot; list below.
6. If you do not know what to do with a word and it is a common word or form, ask on slack. If you are not sure but it is not a common issue, just skip it.
7. [ functional note on the parsing widget ] First click the Edit button so that you see the parsing codes underneath the words. You will only see this button if you have been granted editor status. Then, to verify words select the correct parsing in the list and then click the verify button. If you need to verify a parsing not currently in the list, you must first apply the new parsing to add it to the list.

Principles on specific words and structures are below.

1. נֶגֶב -- Parse as a proper noun in contexts where it appears to refer to a location, and as a common noun is contexts where it appears to refer to a direction.
2. אַחַר -- This word can be a noun, an adverb, or a preposition. The prepositional use is easy to identify because there will be a noun immediately following as its object. Deciding between the noun and the adverb is more difficult and depends on the context, but the general rule would be it's an adverb when modifying a verb, and a noun in other cases.
3. נֹכַח -- Preposition, adverb, or noun. Same as אַחַר.
4. מְעַט -- Adjective, an adverb, or a noun. The general rule is that it's an adjective when describing a noun in attributive position, an adverb when describing a verb, and a noun when it stands by itself.
5. יַעַן -- Preposition or conjunction
6. מַיִם, שמים -- plural (not dual)
7. הַ/הוּא (and similar) -- Personal or demonstrative pronoun
8. אבל – adverb or ??
9. תּמיד – noun or adverb
10. סָּבִיב – noun (gender both)
11. אָכֵן – adverb or
12. יַחַד – adverb or noun
13. אֵצֶל -- preposition
14. עוד -- adverb or conjunction
15. זולת/ך (and the like) -- preposition/suffix
16. רְחֹב (H7339) -- feminine noun
17. אוֹיֵב -- participle
18. Words on [this list](https://github.com/openscriptures/morphhb-parsing/blob/master/morphhb-scripts/bothNouns.txt) should be verified to be gender both in all cases. Words that do not make the list should be masculine or feminine.
19. Participles in the Qal Passive, Pual, and Hophal stems should be parsed as passive participles. Niphal and Hithpael participles can be either passive or active, depending on the verb: if the verb is reflexive action, the participle should be parsed as active; if the verb is passive action, the participle should be parsed as passive.
20. Words with a suffix that is 3fs in form but 3ms in meaning should be parsed 3fs.
21. Words designating a role or position that could be parsed as participles or nouns should be parsed participles (eg. הַ/חֹזֶה and הָ/רֹאֶ֖ה)
22. שְׁאוֹל -- proper noun
23. רִאשׁוֹן -- parse as a normal adjective unless context makes clear it is being used as an ordinal number (cf. Exo 12:15, Esther 3:7 &ldquo;בַּ/חֹ֣דֶשׁ הָ/רִאשׁ֗וֹן&rdquo;).
24. For words/phrases which can be parsed either proper or common nouns (eg. בְּ/גֵ֣יא הַמֶּ֔לַח in 1Chron 18:12), prefer the common noun parsing unless it is absolutely clear that the word/phrase is a proper name.
25. כָּל -- when preceding אשר with this pointing (not כֹּל), should be marked construct
26. A 2ms with imperfect/jussive form following the negative particle אל is a jussive
27. Cohortatives can have the ה ending, but can also look like 1 person imperfects. Without the ה ending, we will prefer the imperfect parsing unless context makes very clear a cohortative is intended.
28. Jussives are often the exact same form as their imperfect counterparts. As with cohortatives, we will prefer the imperfect parsing unless context makes very clear a jussive is intended (eg. #26 above)
