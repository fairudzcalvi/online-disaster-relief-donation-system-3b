<?php
require_once '../config/database.php';

// PayMongo sends a POST with a signature header
$payload   = file_get_contents("php://input");
$sigHeader = $_SERVER['HTTP_PAYMONGO_SIGNATURE'] ?? '';
$webhookSecret = getenv('PAYMONGO_WEBHOOK_SECRET') ?: '';

// Verify signature if webhook secret is set
if ($webhookSecret && $sigHeader) {
    $parts = [];
    foreach (explode(',', $sigHeader) as $part) {
        [$k, $v] = explode('=', $part, 2);
        $parts[$k] = $v;
    }
    $timestamp = $parts['t'] ?? '';
    $testSig   = $parts['te'] ?? '';
    $liveSig   = $parts['li'] ?? '';

    $computed = hash_hmac('sha256', $timestamp . '.' . $payload, $webhookSecret);
    $expected = $testSig ?: $liveSig;

    if (!hash_equals($computed, $expected)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid signature"]);
        exit;
    }
}

$event = json_decode($payload, true);
$eventType = $event['data']['attributes']['type'] ?? '';

// Handle source.chargeable — payment is ready to charge
if ($eventType === 'source.chargeable') {
    $sourceId = $event['data']['attributes']['data']['id'] ?? '';
    $amount   = $event['data']['attributes']['data']['attributes']['amount'] ?? 0;

    if (!$sourceId) {
        http_response_code(400);
        exit;
    }

    $secretKey = getenv('PAYMONGO_SECRET_KEY') ?: 'sk_test_YOUR_SECRET_KEY_HERE';

    // Create a Payment to charge the source
    $chargePayload = [
        "data" => [
            "attributes" => [
                "amount"      => $amount,
                "currency"    => "PHP",
                "description" => "BayanihanRelief Donation",
                "source"      => [
                    "id"   => $sourceId,
                    "type" => "source"
                ]
            ]
        ]
    ];

    $ch = curl_init("https://api.paymongo.com/v1/payments");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($chargePayload),
        CURLOPT_HTTPHEADER     => [
            "Content-Type: application/json",
            "Authorization: Basic " . base64_encode($secretKey . ":")
        ]
    ]);
    $chargeResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        // Update donation status to verified
        $conn = getDBConnection();
        $conn->prepare("UPDATE donations SET Status = 'verified' WHERE Receipt_Path = ?")
             ->execute([$sourceId]);
    }
}

// Handle source.failed — payment was declined or expired
if ($eventType === 'source.failed') {
    $sourceId = $event['data']['attributes']['data']['id'] ?? '';

    if ($sourceId) {
        $conn = getDBConnection();
        $conn->prepare("UPDATE donations SET Status = 'failed' WHERE Receipt_Path = ?")
             ->execute([$sourceId]);
    }
}

http_response_code(200);
echo json_encode(["status" => "success"]);
?>
