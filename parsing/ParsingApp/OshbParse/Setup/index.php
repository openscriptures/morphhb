<?php
// Test for OshbData.php
include 'OshbData.php';
$sblBook = 'Hag';
$instance = new OshbData();
$wordArray = array();
$wordArray[] = $instance->open($sblBook);
while ($wordArray[] = $instance->next()) {}
echo '<pre>';
print_r($wordArray);
echo '</pre>';
?>