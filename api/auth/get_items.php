<?php
require_once __DIR__ . '/../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

try {
    $sql = "SELECT Item_ID as id, Item_Name as name, Item_Category as category,
                   Item_Amount as quantity, Item_Unit as unit, Item_Donor as donor,
                   Item_Date as dateReceived, Item_Location as storageLocation,
                   Item_Expiration_Date as expiryDate, Item_Status as status, Notes as notes
            FROM in_kind_donations
            ORDER BY Item_Date DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $items = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $items]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

