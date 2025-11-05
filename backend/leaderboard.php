<?php
header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include('connection.php');


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Invalid method']);
  exit;
}




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
