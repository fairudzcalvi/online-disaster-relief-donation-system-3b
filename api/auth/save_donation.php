<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Accept FormData (multipart) — JS now sends FormData with optional file
$firstName     = trim($_POST['firstName'] ?? '');
$lastName      = trim($_POST['lastName'] ?? '');
$email         = trim($_POST['email'] ?? '');
$phone         = trim($_POST['phone'] ?? '');
$message       = trim($_POST['message'] ?? '');
$anonymous     = !empty($_POST['anonymous']) && $_POST['anonymous'] !== 'false' ? 1 : 0;
$amount        = $_POST['amount'] ?? 0;
$paymentMethod = trim($_POST['paymentMethod'] ?? '');

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

// Handle receipt file upload
$receiptPath = '';
if (!empty($_FILES['receipt']['tmp_name'])) {
    $uploadDir = '../../uploads/receipts/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $ext = pathinfo($_FILES['receipt']['name'], PATHINFO_EXTENSION);
    $safeExt = in_array(strtolower($ext), ['jpg','jpeg','png','gif','webp']) ? strtolower($ext) : 'jpg';
    $filename = 'receipt_' . uniqid() . '.' . $safeExt;
    if (move_uploaded_file($_FILES['receipt']['tmp_name'], $uploadDir . $filename)) {
        $receiptPath = 'uploads/receipts/' . $filename;
    }
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
        "status"    => "success",
        "message"   => "Donation submitted successfully",
        "reference" => $reference
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>

