<?php

include('connection.php');

$sql = "SELECT name, score, duration FROM players
        ORDER BY score DESC
        LIMIT 100";

$res = $conn->query($sql);
$rows = [];
if ($res) {
  while ($r = $res->fetch_assoc()) {
    $rows[] = [
      'name'     => $r['name'],
      'score'    => (int)$r['score'],
      'duration' => (int)$r['duration']
    ];
  }
}

$conn->close();

echo json_encode(['ok' => true, 'items' => $rows]);
