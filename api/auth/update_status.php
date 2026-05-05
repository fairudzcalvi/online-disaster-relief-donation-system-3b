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

$data   = json_decode(file_get_contents("php://input"), true);
$type   = trim($data['type'] ?? '');   // 'donation', 'item', 'distribution'
$id     = $data['id'] ?? null;
$status = trim($data['status'] ?? '');

if (!$type || !$id || !$status) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

try {
    switch ($type) {
        case 'donation':
            $allowed = ['pending','verified','received','distributed','rejected'];
            if (!in_array($status, $allowed)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid status"]);
                exit;
            }
            $conn->prepare("UPDATE donations SET Status = ? WHERE Donation_ID = ?")
                 ->execute([$status, $id]);
            break;

        case 'item':
            $allowed = ['pending','verified','stored','allocated','distributed'];
            if (!in_array($status, $allowed)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid status"]);
                exit;
            }
            $conn->prepare("UPDATE in_kind_donations SET Item_Status = ? WHERE Item_ID = ?")
                 ->execute([$status, $id]);
            break;

        case 'distribution':
            $allowed = ['pending','ongoing','completed','cancelled'];
            if (!in_array($status, $allowed)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid status"]);
                exit;
            }
            $conn->prepare("UPDATE distributions SET Status = ? WHERE Distribution_ID = ?")
                 ->execute([$status, $id]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Unknown type"]);
            exit;
    }

    echo json_encode(["status" => "success", "message" => "Status updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
