<?php
/**
 * Books contains a lookup table for converting SBL book abbreviations
 * to normal book names.
 *
 * @author troidl
 */
class Books
{
    static $ot = array("Gen" => "Genesis", "Exod" => "Exodus",
        "Lev" => "Leviticus", "Num" => "Numbers", "Deut" => "Deuteronomy",
        "Josh" => "Joshua", "Judg" => "Judges", "1Sam" => "1 Samuel",
        "2Sam" => "2 Samuel", "1Kgs" => "1 Kings", "2Kgs" => "2 Kings",
        "Isa" => "Isaiah", "Jer" => "Jeremiah", "Ezek" => "Ezekiel",
        "Hos" => "Hosea", "Joel" => "Joel", "Amos" => "Amos",
        "Obad" => "Obadiah", "Jonah" => "Jonah", "Mic" => "Micah",
        "Nah" => "Nahum", "Hab" => "Habakkuk", "Zeph" => "Zephaniah",
        "Hag" => "Haggai", "Zech" => "Zechariah", "Mal" => "Malachi",
        "Ps" => "Psalms", "Prov" => "Proverbs", "Job" => "Job",
        "Song" => "Song of Songs", "Ruth" => "Ruth", "Lam" => "Lamentations",
        "Eccl" => "Ecclesiastes", "Esth" => "Esther", "Dan" => "Daniel",
        "Ezra" => "Ezra", "Neh" => "Nehemiah", "1Chr" => "1 Chronicles",
        "2Chr" => "2 Chronicles");
    
    static $num = array("Gen" => "1", "Exod" => "2", "Lev" => "3", "Num" => "4",
        "Deut" => "5", "Josh" => "6", "Judg" => "7", "1Sam" => "8",
        "2Sam" => "9", "1Kgs" => "10", "2Kgs" => "11", "Isa" => "12",
        "Jer" => "13", "Ezek" => "14", "Hos" => "15", "Joel" => "16",
        "Amos" => "17", "Obad" => "18", "Jonah" => "19", "Mic" => "20",
        "Nah" => "21", "Hab" => "22", "Zeph" => "23", "Hag" => "24",
        "Zech" => "25", "Mal" => "26", "Ps" => "27", "Prov" => "28",
        "Job" => "29", "Song" => "30", "Ruth" => "31", "Lam" => "32",
        "Eccl" => "33", "Esth" => "34", "Dan" => "35", "Ezra" => "36",
        "Neh" => "37", "1Chr" => "38", "2Chr" => "39");
    
    static $chapters = array("Gen" => "50", "Exod" => "40", "Lev" => "27",
        "Num" => "36", "Deut" => "34", "Josh" => "24", "Judg" => "21",
        "1Sam" => "31", "2Sam" => "24", "1Kgs" => "22", "2Kgs" => "25",
        "Isa" => "66", "Jer" => "52", "Ezek" => "48", "Hos" => "14",
        "Joel" => "4", "Amos" => "9", "Obad" => "1", "Jonah" => "4",
        "Mic" => "7", "Nah" => "3", "Hab" => "3", "Zeph" => "3", "Hag" => "2",
        "Zech" => "14", "Mal" => "3", "Ps" => "150", "Prov" => "31",
        "Job" => "42", "Song" => "8", "Ruth" => "4", "Lam" => "5",
        "Eccl" => "12", "Esth" => "10", "Dan" => "12", "Ezra" => "10",
        "Neh" => "13", "1Chr" => "29", "2Chr" => "36");
}
?>