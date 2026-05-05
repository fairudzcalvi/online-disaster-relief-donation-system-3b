<?php
require_once __DIR__ . '/../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$itemId       = $_POST['itemId'] ?? null;
$itemName     = trim($_POST['itemName'] ?? '');
$category     = trim($_POST['category'] ?? '');
$quantity     = trim($_POST['quantity'] ?? '');
$unit         = trim($_POST['unit'] ?? '');
$donorName    = trim($_POST['donorName'] ?? '');
$dateReceived = trim($_POST['dateReceived'] ?? '');
$location     = trim($_POST['storageLocation'] ?? '');
$expiryDate   = trim($_POST['expiryDate'] ?? '') ?: null;
$notes        = trim($_POST['notes'] ?? '');

if ($itemName === '' || $category === '' || $quantity === '' ||
    $unit === '' || $donorName === '' || $dateReceived === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

if (!is_numeric($quantity) || (int)$quantity < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Quantity must be a positive number"]);
    exit;
}

try {
    if ($itemId) {
        $sql = "UPDATE in_kind_donations SET
                    Item_Name = ?, Item_Category = ?, Item_Amount = ?, Item_Unit = ?,
                    Item_Donor = ?, Item_Date = ?, Item_Location = ?,
                    Item_Expiration_Date = ?, Notes = ?
                WHERE Item_ID = ?";
        $conn->prepare($sql)->execute([
            $itemName, $category, (int)$quantity, $unit,
            $donorName, $dateReceived, $location,
            $expiryDate, $notes, $itemId
        ]);
        echo json_encode(["status" => "success", "message" => "Item updated successfully"]);
    } else {
        $sql = "INSERT INTO in_kind_donations
                    (Item_Name, Item_Category, Item_Amount, Item_Unit, Item_Donor,
                     Item_Date, Item_Location, Item_Expiration_Date, Notes, Item_Status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        $conn->prepare($sql)->execute([
            $itemName, $category, (int)$quantity, $unit,
            $donorName, $dateReceived, $location, $expiryDate, $notes
        ]);
        echo json_encode(["status" => "success", "message" => "Item added successfully"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

