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
$amount        = (float)($data['amount'] ?? 0);
$paymentMethod = trim($data['paymentMethod'] ?? ''); // 'gcash' or 'maya'

if (!$firstName || !$lastName || !$email || $amount < 100 || !$paymentMethod) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address"]);
    exit;
}

// PayMongo secret key — set this in your environment variable
$secretKey = getenv('PAYMONGO_SECRET_KEY') ?: 'sk_test_YOUR_SECRET_KEY_HERE';

// Amount in centavos (PayMongo uses smallest currency unit)
$amountCentavos = (int)($amount * 100);

// Determine the base URL dynamically
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$baseUrl = $protocol . '://' . $host . '/online_disaster/public_html';

// Map payment method to PayMongo source type
$sourceType = $paymentMethod === 'maya' ? 'paymaya' : 'gcash';

// Generate reference number early so it can be used in the redirect URL
$reference = 'DON-' . strtoupper(substr(md5(uniqid()), 0, 8));

// Create PayMongo Source
$payload = [
    "data" => [
        "attributes" => [
            "amount"   => $amountCentavos,
            "currency" => "PHP",
            "type"     => $sourceType,
            "redirect" => [
                "success" => $baseUrl . "/donation-page.html?payment=success&ref=" . urlencode($reference) . "&amt=" . urlencode($amount),
                "failed"  => $baseUrl . "/donation-page.html?payment=failed"
            ],
            "billing"  => [
                "name"  => trim($firstName . ' ' . $lastName),
                "email" => $email,
                "phone" => $phone ?: null
            ]
        ]
    ]
];

$ch = curl_init("https://api.paymongo.com/v1/sources");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        "Content-Type: application/json",
        "Authorization: Basic " . base64_encode($secretKey . ":")
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    $err = json_decode($response, true);
    $errMsg = $err['errors'][0]['detail'] ?? 'PayMongo error';
    http_response_code(502);
    echo json_encode(["status" => "error", "message" => $errMsg]);
    exit;
}

$source = json_decode($response, true);
$sourceId       = $source['data']['id'];
$checkoutUrl    = $source['data']['attributes']['redirect']['checkout_url'];

// Save pending donation to DB with source ID as reference
$conn = getDBConnection();

try {
    $sql = "INSERT INTO donations
                (Donor_FirstName, Donor_LastName, Donor_Email, Donor_Phone,
                 Donor_Message, Is_Anonymous, Donation_Amount, Payment_Method,
                 Reference_Number, Receipt_Path, Status, Donation_Date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
    $conn->prepare($sql)->execute([
        $firstName, $lastName, $email, $phone,
        $message, $anonymous, $amount, $paymentMethod,
        $reference, $sourceId
    ]);

    echo json_encode([
        "status"       => "success",
        "checkoutUrl"  => $checkoutUrl,
        "reference"    => $reference,
        "sourceId"     => $sourceId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
