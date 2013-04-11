<?php
require_once '../DataPass.php';
require_once ('Library/DBConnect.php');                             # Include Database Connection Class.
$hbDB = new DBConnect('localhost',DataPass::User(),DataPass::Pass(),'oshbParse');  # hb database connection.

include 'Model/Books.php';

if (isset($_GET['ref'])) {
    $ref = $_GET['ref'];
//    include 'Model/ChapterMarkup.php';
//    $instance = new ChapterMarkup($ref);
    include 'Model/EditorMarkup.php';
    $instance = new EditorMarkup($ref);
    echo $instance->getMarkup();
} else if (isset($_POST['data'])) { // Update for the data.
    $data = stripslashes(urldecode($_POST['data']));
    $memberId = 1;
    include 'Model/SaveParsing.php';
    $instance = new SaveParsing($data);
    echo $instance->Save($memberId);
} else {
    include 'View/ParseView.php';
}
?>