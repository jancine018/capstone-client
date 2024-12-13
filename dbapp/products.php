<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow cross-origin requests

// Require the db.php file with the MySQLi connection
require 'db.php';

// Check if the connection was successful
if (!$con) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Query to fetch products with their variants
$query = "
    SELECT 
        p.product_id, 
        p.name AS product_name, 
        p.description, 
        p.base_price, 
        p.type, 
        p.image_url AS product_image,
        v.variant_id, 
        v.variant_name, 
        v.additional_price, 
        v.stock_quantity, 
        v.image_url AS variant_image
    FROM 
        Products p
    LEFT JOIN 
        Variants v ON p.product_id = v.product_id
    ORDER BY 
        p.product_id, v.variant_id;
";

$result = mysqli_query($con, $query);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . mysqli_error($con)]);
    exit();
}

// Process the results into a structured array
$products = [];
while ($row = mysqli_fetch_assoc($result)) {
    $productId = $row['product_id'];
    
    // Initialize product if not already set
    if (!isset($products[$productId])) {
        $products[$productId] = [
            "product_id" => $row['product_id'],
            "name" => $row['product_name'],
            "description" => $row['description'],
            "base_price" => $row['base_price'],
            "type" => $row['type'],
            "image_url" => $row['product_image'],
            "variants" => []
        ];
    }
    
    // Add variant to the product if variant data exists
    if ($row['variant_id']) {
        $products[$productId]["variants"][] = [
            "variant_id" => $row['variant_id'],
            "variant_name" => $row['variant_name'],
            "additional_price" => $row['additional_price'],
            "stock_quantity" => $row['stock_quantity'],
            "image_url" => $row['variant_image']
        ];
    }
}

// Re-index the products array and output as JSON
echo json_encode(array_values($products), JSON_PRETTY_PRINT);

// Close the database connection
mysqli_close($con);
?>
