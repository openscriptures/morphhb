<?php
if (isset($_GET['ref'])) {
    $ref = $_GET['ref'];
    $bc = explode('.', $ref);
    include 'Model/Book.php';
    $instance = new Book($bc[0]);
    echo $instance->getChapter($bc[1]);
} else {
    $bc = array('Gen', 1);
    include 'Model/Books.php';
    include 'View/ParseView.php';
}
?>