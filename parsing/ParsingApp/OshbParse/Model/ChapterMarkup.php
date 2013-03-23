<?php
/**
 * ChapterMarkup constructs the HTML markup for the chapter.
 *
 * @author troidl
 */
class ChapterMarkup
{
    private $ref;
    /**
     * The constructor records the chapter reference.
     * @param string $ref
     */
    function __construct($ref)
    {
        $this->ref = $ref;
    }
    /**
     * Gets the chapter markup.
     * @return string
     */
    function getMarkup()
    {
        return $this->MarkupChapter();
    }
    /**
     * Parses and validates the reference.
     * @param string $ref
     * @return boolean|array
     */
    private function ParseRef($ref)
    {
        if (strlen($ref) < 8) {
            $fields = explode('.', $ref);
            if (count($fields) == 2 && isset(Books::$num[$fields[0]])) {
                return array('book' => Books::$num[$fields[0]], 'chapter' => $fields[1]);
            }
        }
        return FALSE;
    }
    /**
     * Retrieves the chapter from the database.
     * @param string $ref
     * @return array
     */
    private function RetrieveChapter($ref)
    {
        $mysqli = new mysqli('localhost', 'root', 'root4#One', 'oshbParse');
        if ($mysqli->connect_error) {
            die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
        }
        $mysqli->query("SET NAMES 'utf8'");
        $sql = 'SELECT * FROM words WHERE (bookId="' . $ref['book'] . '" AND chapter="' . $ref['chapter'] . '");';
        $result = $mysqli->query($sql);
        // Gather the results.
        $wordList = array();
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $wordList[] = $row;
        }
        $result->free();
        $mysqli->close();
        return $wordList;
    }
    /**
     * Marks up the word.
     * @param array $data
     * @return string
     */
    private function MarkupWord($data)
    {
        $markup = '<span id="' . $this->ref . '.' . $data['verse'] . '.' . $data['number'] . '"';
        $markup .= ' class="Hebrew" title="' . $data['lemma'];
        if ($data['morph']) {
            $markup .= "&#10;" . $data['morph'];
        }
        $markup .= '">';
        $markup .= $data['word'];
        $markup .= '</span>';
        // Check word type.
        if ($data['type'] != 'word') {
            $markup = '<span class="' . $data['type'] . '">' . $markup . '</span>';
        }
        // Mark up append.
        $markup .= '<span class="punctuation">' . $data['append'] . '</span>';
        return $markup;
    }
    /**
     * Marks up each verse.
     * @param array $wordArray
     * @return string
     */
    private function MarkupVerse($wordArray)
    {
        $verseNumber = 0;
        $markup = '';
        foreach ($wordArray as $data) {
            if ($data['verse'] != $verseNumber) {
                if ($verseNumber) {
                    $markup .= '</span> ';
                }
                $markup .= '<span id="' . $this->ref . '.' . $data['verse'] . '">';
                $markup .= '<sup class="osisID">' . $data['verse'] . "</sup>&#160;";
                $verseNumber = $data['verse'];
            }
            $markup .= $this->MarkupWord($data);
        }
        $markup .= '</span>'; // End of last verse.
        return $markup;
    }
    /**
     * Constructs the chapter name.
     * @return string
     */
    private function ChapterName()
    {
        $bc = explode('.', $this->ref);
        return Books::$ot[$bc[0]] . ' ' . $bc[1];
    }
    /**
     * Marks up the chapter.
     * @return string|boolean
     */
    private function MarkupChapter()
    {
        $fields = $this->ParseRef($this->ref);
        if ($fields) {
            $wordArray = $this->RetrieveChapter($fields);
            $markup = '<div>';
            $markup .= '<div id ="' . $this->ref . '">';
            $markup .= '<span class="chapter">' . $this->ChapterName() . '</span>';
            $markup .= $this->MarkupVerse($wordArray);
            $markup .= '</div>';
            $markup .= '</div>';
            return $markup;
        } else {
            return '<p>Bad reference.</p>';
        }
    }
}

?>