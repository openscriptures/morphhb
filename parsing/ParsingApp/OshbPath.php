<?php
/**
 * OshbPath holds location paths for data resources.
 *
 * @author troidl
 */
class OshbPath
{
    private static $wlc = 'E:/Hebrew UniVerse/HebrewOT/WLC/';
    private static $lex = 'E:/Hebrew UniVerse/HebrewOT/Lexicon/';
	/**
	 * Gets the path to the WLC.
     * @return string
	 */
    static function WLC()
    {
        return self::$wlc;
    }
	/**
	 * Gets the path to the Lexicon.
     * @return string
	 */
    static function Lexicon()
    {
        return self::$lex;
    }
}
?>