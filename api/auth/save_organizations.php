<?php
require_once '../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$orgId         = $_POST['orgId'] ?? null;
$orgName       = trim($_POST['orgName'] ?? '');
$orgType       = trim($_POST['orgType'] ?? '');
$orgStatus     = trim($_POST['orgStatus'] ?? '');
$contactPerson = trim($_POST['contactPerson'] ?? '');
$position      = trim($_POST['position'] ?? '');
$email         = trim($_POST['email'] ?? '');
$phone         = trim($_POST['phone'] ?? '');
$address       = trim($_POST['address'] ?? '');
$website       = trim($_POST['website'] ?? '');
$notes         = trim($_POST['notes'] ?? '');

if ($orgName === '' || $orgType === '' || $contactPerson === '' || $email === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address"]);
    exit;
}

$binaryStatus = ($orgStatus === 'active') ? 1 : 0;

try {
    if ($orgId) {
        $sql = "UPDATE organization SET
                    Organization_Name = ?, Organization_Contact_Person = ?,
                    Organization_Contact_Person_Position = ?, Organization_Email = ?,
                    Organization_Phone = ?, Organization_Type = ?, Organization_Address = ?,
                    Organization_Link = ?, Admin_Notes = ?, Organization_Status = ?
                WHERE Organization_ID = ?";
        $conn->prepare($sql)->execute([
            $orgName, $contactPerson, $position, $email, $phone,
            $orgType, $address, $website, $notes, $binaryStatus, $orgId
        ]);
        echo json_encode(["status" => "success", "message" => "Organization updated successfully"]);
    } else {
        $sql = "INSERT INTO organization
                    (Organization_Name, Organization_Contact_Person,
                     Organization_Contact_Person_Position, Organization_Email,
                     Organization_Phone, Organization_Type, Organization_Address,
                     Organization_Link, Admin_Notes, Organization_Created, Organization_Status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
        $conn->prepare($sql)->execute([
            $orgName, $contactPerson, $position, $email, $phone,
            $orgType, $address, $website, $notes, $binaryStatus
        ]);
        echo json_encode(["status" => "success", "message" => "Organization added successfully"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
