<?php
require_once '../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
$admin = verifyAdminToken($conn);

$stmt = $conn->prepare("UPDATE admins SET token = NULL WHERE id = :id");
$stmt->bindParam(':id', $admin['id']);
$stmt->execute();

http_response_code(200);
echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>
