<?php

    include('connection.php');

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $name = null;

    if (is_array($data) && isset($data['name'])) {
        $name = $data['name'];
    }

    if(!$name){
        echo json_encode(["error" => "Name is required"]);
        exit;
    }

    $score = random_int(0,100);

    $duration = random_int(30, 600);

    $sql = "Insert INTO players (name, score, duration) VALUES (?,?,?)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("sii", $name, $score, $duration);
    $stmt->execute();

    $new_id = $stmt->insert_id;
    $stmt->close();
    $conn->close();

    echo json_encode([
        "ok" => true,
        "created" => [
            "id"       => $new_id,
            "name"     => $name,
            "score"    => $score,
            "duration" => $duration
        ]
    ]);
?> 