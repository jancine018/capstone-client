<?php
require 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id'], $data['product_id'], $data['variant_id'], $data['quantity'])) {
        $user_id = intval($data['user_id']);
        $product_id = intval($data['product_id']);
        $variant_id = intval($data['variant_id']);
        $quantity = intval($data['quantity']);

        $sql = "INSERT INTO cart (user_id, product_id, variant_id, quantity) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("iiiii", $user_id, $product_id, $variant_id, $quantity, $quantity);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Item added to cart"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add item to cart"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
