<?php
/**
 * SaveParsing validates and saves the given parsing.
 *
 * @author troidl
 */
class SaveParsing
{
    private $fields;
    /**
     * The constructor validates and stores the data.
     * @param string $data
     */
    function __construct($data)
    {
        $this->fields = $this->Validate($data);
    }
    /**
     * Saves the data, attributed to the member.
     * @param int $memberId
     * @return boolean
     */
    function Save($memberId)
    {
        return $this->CheckStatus($memberId);
    }
    /**
     * Parses & validates the data.
     * @param string $data
     * @return boolean|array
     */
    private function Validate($data)
    {
        if (strlen($data) < 40) {
            $fields = preg_split("/[.\s]/", $data);
            if (count($fields) == 5 && isset(Books::$num[$fields[0]])) {
                return array('bookId' => Books::$num[$fields[0]],
                    'chapter' => $fields[1], 'verse' => $fields[2],
                    'number' => $fields[3], 'morph' => $fields[4]);
            }
        }
        return FALSE;
    }
    /**
     * Retrieves the row from the database.
     * @global DBConnect $hbDB
     * @return array
     */
    private function RetrieveRow()
    {
        global $hbDB;
        
        $sql = 'SELECT * FROM words WHERE (bookId="' . $this->fields['bookId'];
        $sql .= '" AND chapter="' . $this->fields['chapter'];
        $sql .= '" AND verse="' . $this->fields['verse'];
        $sql .= '" AND number="' . $this->fields['number'] . '");';
        $result = $hbDB->dbquery($sql);
        $row = $result->fetch_assoc();
        $result->free();
        return $row;
    }
    /**
     * Sets an alert for changes to the chapter.
     * @global DBConnect $hbDB
     * @return type
     */
    private function SetAlert()
    {
        global $hbDB;
        
        $sql = 'UPDATE alerts SET status="changed"';
        $sql .= ' WHERE bookId=' . $this->fields['bookId'];
        $sql .= ' AND chapter=' . $this->fields['chapter'];
        return $hbDB->query($sql);
    }
    /**
     * Updates the row.
     * @global DBConnect $hbDB
     * @param string $sql
     * @return boolean
     */
    private function UpdateRow($sql)
    {
        global $hbDB;
        
        return $this->SetAlert() && $hbDB->query($sql);
    }
    /**
     * Writes a note to the database, and returns its ID.
     * @global DBConnect $hbDB
     * @param string $note
     * @return int
     */
    private function WriteNote($note)
    {
        global $hbDB;
        
        $sql = 'INSERT INTO notes SET note="' . $note . '";';
        $hbDB->query($sql);
        return $hbDB->insert_id;
    }
    /**
     * Updates the row, based on the status.
     * @param int $memberId
     * @return boolean
     */
    private function CheckStatus($memberId)
    {
        if ($this->fields) {
            $row = $this->RetrieveRow();
            switch ($row['status']) {
                case 'none':
                    // Save the parsing.
                    $sql = 'UPDATE words SET morph="' . $this->fields['morph'];
                    $sql .= '", status="single", parser=' . $memberId;
                    $sql .= ' WHERE id=' . $row['id'];
                    return $this->UpdateRow($sql);
                case 'single':
                    // Compare morph & parser.
                    if ($this->fields['morph'] != $row['morph']) {
                        $noteId = $this->WriteNote($this->fields['morph']);
                        $sql = 'UPDATE words SET status="conflict"';
                        $sql .= ', check=' . $memberId . ', notes=' . $noteId;
                        $sql .= ' WHERE id=' . $row['id'];
                        return $this->UpdateRow($sql);
                    } elseif ($memberId != $row['parser']) {
                        $sql = 'UPDATE words SET status="confirmed"';
                        $sql .= ', check=' . $memberId;
                        $sql .= ' WHERE id=' . $row['id'];
                        return $this->UpdateRow($sql);
                    }
                    return TRUE;
                case 'conflict':
                case 'error':
                case 'confirmed':
                case 'verified':
                    // Add a note.
                    $noteId = $this->WriteNote($memberId . ': ' . $this->fields['morph']);
                    if ($row['notes']) {
                        $noteId = $row['notes'] . ',' . $noteId;
                    }
                    $sql = 'UPDATE words SET notes=' . $noteId;
                    $sql .= ' WHERE id=' . $row['id'];
                    return $this->UpdateRow($sql);
            }
        }
        return FALSE;
    }
}

?>