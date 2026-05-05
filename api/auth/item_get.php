<?php
require_once __DIR__ . '/../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

try {
    $stmt = $conn->prepare("SELECT COUNT(Item_ID) AS total FROM in_kind_donations");
    $stmt->execute();
    $row = $stmt->fetch();
    echo json_encode(['status' => 'success', 'total' => (int)$row['total']]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>

