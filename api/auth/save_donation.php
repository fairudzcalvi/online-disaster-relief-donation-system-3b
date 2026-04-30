<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$firstName     = trim($data['firstName'] ?? '');
$lastName      = trim($data['lastName'] ?? '');
$email         = trim($data['email'] ?? '');
$phone         = trim($data['phone'] ?? '');
$message       = trim($data['message'] ?? '');
$anonymous     = !empty($data['anonymous']) ? 1 : 0;
$amount        = $data['amount'] ?? 0;
$paymentMethod = trim($data['paymentMethod'] ?? '');
$receiptPath   = trim($data['receiptPath'] ?? '');

if ($firstName === '' || $lastName === '' || $email === '' || $amount <= 0 || $paymentMethod === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address"]);
    exit;
}

if ($amount < 100) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Minimum donation amount is PHP 100"]);
    exit;
}

$conn = getDBConnection();
$reference = 'DON-' . strtoupper(substr(md5(uniqid()), 0, 8));

try {
    $sql = "INSERT INTO donations
                (Donor_FirstName, Donor_LastName, Donor_Email, Donor_Phone,
                 Donor_Message, Is_Anonymous, Donation_Amount, Payment_Method,
                 Reference_Number, Receipt_Path, Status, Donation_Date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
    $conn->prepare($sql)->execute([
        $firstName, $lastName, $email, $phone,
        $message, $anonymous, (float)$amount, $paymentMethod,
        $reference, $receiptPath
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Donation submitted successfully",
        "reference" => $reference
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
