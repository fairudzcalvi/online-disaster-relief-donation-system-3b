<?php
require_once '../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

try {
    $sql = "SELECT Distribution_ID as id, Refferences as reference, Location as location,
                   TIME_DATE as date, Distribution_Type as type,
                   Beneficiaries as beneficiaries, Team_Leader as teamLeader,
                   Team_Members as teamMembers, Status as status,
                   Money_minimum_limit as monetaryLimit, Notes as notes,
                   Created_At as createdDate
            FROM distributions
            ORDER BY TIME_DATE DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $distributions = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $distributions]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
