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

$distributionId   = $_POST['distributionId'] ?? null;
$location         = trim($_POST['location'] ?? '');
$distributionDate = trim($_POST['distributionDate'] ?? '');
$distributionType = trim($_POST['distributionType'] ?? 'mixed');
$beneficiaries    = trim($_POST['beneficiaries'] ?? '');
$teamLeader       = trim($_POST['teamLeader'] ?? '');
$teamMembers      = trim($_POST['teamMembers'] ?? '');
$notes            = trim($_POST['notes'] ?? '');
$monetaryAmount   = trim($_POST['monetaryAmount'] ?? '0');

if ($location === '' || $distributionDate === '' ||
    $distributionType === '' || $beneficiaries === '' || $teamLeader === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

if (!is_numeric($beneficiaries) || (int)$beneficiaries < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Beneficiaries must be a positive number"]);
    exit;
}

$moneyLimit = 0;
if (($distributionType === 'monetary' || $distributionType === 'mixed') &&
    is_numeric($monetaryAmount) && is_numeric($beneficiaries)) {
    $moneyLimit = (float)$monetaryAmount * (int)$beneficiaries;
}

try {
    if ($distributionId) {
        $sql = "UPDATE distributions SET
                    Location = ?, TIME_DATE = ?, Distribution_Type = ?,
                    Beneficiaries = ?, Team_Leader = ?, Team_Members = ?,
                    Money_minimum_limit = ?, Notes = ?
                WHERE Distribution_ID = ?";
        $conn->prepare($sql)->execute([
            $location, $distributionDate, $distributionType,
            (int)$beneficiaries, $teamLeader, $teamMembers,
            $moneyLimit, $notes, $distributionId
        ]);
        echo json_encode(["status" => "success", "message" => "Distribution updated successfully"]);
    } else {
        $reference = "REF-" . strtoupper(substr(md5(uniqid()), 0, 8));
        $sql = "INSERT INTO distributions
                    (Refferences, Location, TIME_DATE, Distribution_Type,
                     Beneficiaries, Team_Leader, Team_Members,
                     Status, Money_minimum_limit, Notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)";
        $conn->prepare($sql)->execute([
            $reference, $location, $distributionDate, $distributionType,
            (int)$beneficiaries, $teamLeader, $teamMembers,
            $moneyLimit, $notes
        ]);
        echo json_encode(["status" => "success", "message" => "Distribution added successfully"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

