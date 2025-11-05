<?php

$db_host = "localhost";
$db_name = "solitaire_db";
$db_user = "root";
$db_pass = null;

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>