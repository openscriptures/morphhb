<?php
include '../OshbPath.php';
include_once 'Utility/XSLTransform.php';
/**
 * Book manages the given WLC book.
 *
 * @author troidl
 */
class Book
{
    private $name, $book;
    /**
     * The constructor loads the book.
     * @param string $sblBook
     */
    function __construct($sblBook)
    {
        $this->name = $sblBook;
        $this->book = $this->LoadBook($sblBook);
    }
    /**
     * Gets the chapter markup.
     * @param int $number
     * @return string
     */
    function getChapter($number)
    {
        $chapter = $this->FindChapter($number);
        $xml = $this->FormatXML($chapter);
        return $this->Transform($xml);
    }
    /**
     * Loads the book.
     * @param string $sblBook
     * @return \DOMDocument
     */
    private function LoadBook($sblBook)
    {
        $fileName = realpath(OshbPath::WLC() . $sblBook . '.xml');
        $doc = new DOMDocument();
        $doc->load($fileName);
        return $doc;
    }
    /**
     * Finds the chapter.
     * @param int $number
     * @return DOMElement
     */
    private function FindChapter($number)
    {
        $chapters = $this->book->getElementsByTagName('chapter');
        return $chapters->item($number - 1);
    }
    /**
     * Formats the chapter as XML.
     * @param DOMElement $chapter
     * @return string
     */
    private function FormatXML(DOMElement $chapter)
    {
        $xml = <<<'EOD'
<?xml version="1.0" encoding="utf-8"?>
<osis xmlns="http://www.bibletechnologies.net/2003/OSIS/namespace">
EOD;
        $xml .= $this->book->saveXML($chapter);
        $xml .= '</osis>';
        return $xml;
    }
    /**
     * Transforms the chapter to HTML;
     * @param string $xml
     * @return string
     */
    private function Transform($xml)
    {
        $xslPath = 'Model/OsisChapter.xsl';
        $transform = new XSLTransform($xslPath);
        if ($xml) {
            return $transform->Transform($xml);
        } else {
            return '<p>Failed to open: ' . $this->name . '.</p>';
        }
    }
}

?>