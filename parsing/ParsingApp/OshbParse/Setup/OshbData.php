<?php
include '../../OshbPath.php';
/**
 * OshbData iterates through an OSHB book, and returns the data fields.
 *
 * @author David
 */
class OshbData
{
    private $oshbPath, $verseList, $verseIndex, $currentVerse, $wordIndex;
    
    function __construct()
    {
        $this->oshbPath = OshbPath::WLC();
    }
    /**
     * Opens the given book, and returns the first word array.
     * @param type $sblBook
     * @return array
     */
    function open($sblBook)
    {
        $this->verseList = $this->LoadBook($sblBook);
        $this->verseIndex = 0;
        $this->currentVerse = $this->AnalyzeVerse($this->verseList[$this->verseIndex]);
        $this->wordIndex = 0;
        return $this->currentVerse[$this->wordIndex];
    }
    /**
     * Returns the next word array.
     * @return boolean|array
     */
    function next()
    {
        $this->wordIndex++;
        if ($this->wordIndex < count($this->currentVerse)) {
            return $this->currentVerse[$this->wordIndex];
        } else {
            $this->verseIndex++;
            if ($this->verseIndex < count($this->verseList)) {
                $this->currentVerse = $this->AnalyzeVerse($this->verseList[$this->verseIndex]);
                $this->wordIndex = 0;
                return $this->currentVerse[$this->wordIndex];
            } else {
                return FALSE;
            }
        }
    }
    /**
     * Loads a book.
     * @param string $sblBook
     * @return array
     */
    private function LoadBook($sblBook)
    {
        $fileName = $this->oshbPath . $sblBook . '.xml';
        $book = simplexml_load_file($fileName);
        $verseList = array();
        foreach ($book->osisText->div->chapter as $chapter) {
            foreach ($chapter->verse as $verse) {
                $verseList[] = $verse;
            }
        }
        return $verseList;
    }
    /**
     * Sets the word fields.
     * @param string $word
     * @param array $fields
     * @param int $index
     * @param string $type
     * @return array
     */
    private function WordFields(SimpleXMLElement $word, $fields, $index, $type)
    {
        if ($word->count()) {
            $xml = $word->asXML();
            $text = preg_replace("/<[^>]+>/g", '', $xml);
            $type = 'seg';
        } else {
            $text = (string) $word;
        }
        $wordFields = array('book' => $fields[0], 'chapter' => $fields[1], 'verse' => $fields[2]);
        $wordFields['number'] = $index;
        $wordFields['word'] = $text;
        $wordFields['append'] = ' ';
        $wordFields['lemma'] = (string) $word['lemma'];
        $wordFields['morph'] = '';
        $wordFields['type'] = $type;
        $wordFields['status'] = 'none';
        $wordFields['notes'] = '';
        return $wordFields;
    }
    /**
     * Analyzes the current verse.
     * @param SimpleXMLElement $verse
     * @return array
     */
    private function AnalyzeVerse(SimpleXMLElement $verse)
    {
        $wordList = array();
        $index = -1;
        $osisID = (string) $verse['osisID'];
        $fields = explode('.', $osisID);
        foreach ($verse->children() as $child) {
            switch ($child->getName()) {
                case 'w':
                    $index++;
                    $wordList[$index] = $this->WordFields($child, $fields, $index, 'word');
                    break;
                case 'seg':
                    $text = (string) $child;
                    if ($text == '־' || $text == '׃' || $text == '׀') { // Punctuation.
                        $wordList[$index]['append'] = $text;
                    }
                    break;
                case 'note':
                    if ($child->count()) {
                        foreach ($child->rdg->children() as $qere) {
                            if ($qere->getName() == 'w') {
                                $index++;
                                $wordList[$index] = $this->WordFields($qere, $fields, $index, 'qere');
                            } else {
                                $text = (string) $qere;
                                if ($text == '־' || $text == '׃' || $text == '׀') { // Punctuation.
                                    $wordList[$index]['append'] = $text;
                                }
                            }
                        }
                    }
            }
        }
        return $wordList;
    }
}

?>