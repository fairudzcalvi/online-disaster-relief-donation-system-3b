<?php
require_once '../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

try {
    $sql = "SELECT Organization_ID as id, Organization_Name as name,
                   Organization_Type as type, Organization_Status as status,
                   Organization_Contact_Person as contactPerson,
                   Organization_Contact_Person_Position as position,
                   Organization_Email as email, Organization_Phone as phone,
                   Organization_Address as address, Organization_Link as website,
                   Admin_Notes as notes, Organization_Created as registeredDate
            FROM organization
            ORDER BY Organization_Created DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $orgs = $stmt->fetchAll();

    // Normalize status to string
    foreach ($orgs as &$org) {
        $org['status'] = $org['status'] ? 'active' : 'inactive';
    }

    echo json_encode(["status" => "success", "data" => $orgs]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
