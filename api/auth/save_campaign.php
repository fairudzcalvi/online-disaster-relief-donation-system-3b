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

$campaignId   = $_POST['campaignId'] ?? null;
$title        = trim($_POST['title'] ?? '');
$organization = trim($_POST['organization'] ?? '');
$category     = trim($_POST['category'] ?? '');
$description  = trim($_POST['description'] ?? '');
$goal         = $_POST['goal'] ?? 0;
$raised       = $_POST['raised'] ?? 0;
$beneficiaries = trim($_POST['beneficiaries'] ?? '');
$location     = trim($_POST['location'] ?? '');
$startDate    = trim($_POST['startDate'] ?? '');
$endDate      = trim($_POST['endDate'] ?? '') ?: null;
$status       = trim($_POST['status'] ?? 'active');

if ($title === '' || $organization === '' || $category === '' || $description === '' || $startDate === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

try {
    if ($campaignId) {
        $sql = "UPDATE campaigns SET
                    Campaign_Title = ?, Campaign_Organization = ?, Campaign_Category = ?,
                    Campaign_Description = ?, Campaign_Goal = ?, Campaign_Raised = ?,
                    Campaign_Beneficiaries = ?, Campaign_Location = ?,
                    Campaign_Start_Date = ?, Campaign_End_Date = ?, Campaign_Status = ?
                WHERE Campaign_ID = ?";
        $conn->prepare($sql)->execute([
            $title, $organization, $category, $description,
            (float)$goal, (float)$raised, $beneficiaries, $location,
            $startDate, $endDate, $status, $campaignId
        ]);
        echo json_encode(["status" => "success", "message" => "Campaign updated successfully"]);
    } else {
        $sql = "INSERT INTO campaigns
                    (Campaign_Title, Campaign_Organization, Campaign_Category,
                     Campaign_Description, Campaign_Goal, Campaign_Raised,
                     Campaign_Beneficiaries, Campaign_Location,
                     Campaign_Start_Date, Campaign_End_Date, Campaign_Status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $conn->prepare($sql)->execute([
            $title, $organization, $category, $description,
            (float)$goal, (float)$raised, $beneficiaries, $location,
            $startDate, $endDate, $status
        ]);
        $newId = $conn->lastInsertId();
        echo json_encode(["status" => "success", "message" => "Campaign created successfully", "id" => $newId]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

