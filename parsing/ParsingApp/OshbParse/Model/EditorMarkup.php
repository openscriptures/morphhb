<?php
require_once 'ChapterMarkup.php';
/**
 * EditorMarkup marks up a chapter for the Editor interface.
 *
 * @author troidl
 */
class EditorMarkup extends ChapterMarkup
{
    /**
     * Marks up the word.
     * @param array $data
     * @param string $pre
     * @return string
     */
    protected function MarkupWord($data, $pre)
    {
        $markup = '<span class="word">';
        $markup .= $pre . '<span id="' . $this->ref . '.' . $data['verse'] . '.' . $data['number'] . '"';
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
        // Container markup for the editor.
        $markup .= '<br /><span class="morph">';
        $markup .= $data['morph'] ? $data['morph'] : "&nbsp;";
        $markup .= '</span></span>';
        return $markup;
    }
}

?>