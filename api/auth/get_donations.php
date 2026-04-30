<?php
require_once '../config/database.php';
require_once 'verify_token.php';

$conn = getDBConnection();
verifyAdminToken($conn);

try {
    $sql = "SELECT Donation_ID as id, Donor_FirstName as firstName, Donor_LastName as lastName,
                   Donor_Email as email, Donation_Amount as amount,
                   Payment_Method as paymentMethod, Reference_Number as referenceNo,
                   Donation_Date as date, Status as status, Is_Anonymous as anonymous,
                   Donor_Message as message
            FROM donations
            ORDER BY Donation_Date DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $donations = $stmt->fetchAll();

    // Shape data for frontend
    foreach ($donations as &$d) {
        $d['donor'] = [
            'name' => $d['anonymous'] ? 'Anonymous Donor' : trim($d['firstName'] . ' ' . $d['lastName']),
            'email' => $d['anonymous'] ? '—' : $d['email']
        ];
        $d['type'] = 'monetary';
        unset($d['firstName'], $d['lastName']);
    }

    echo json_encode(["status" => "success", "data" => $donations]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
