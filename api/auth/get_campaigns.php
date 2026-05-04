<?php
require_once '../config/database.php';

// Public endpoint — no auth required
$conn = getDBConnection();

try {
    $sql = "SELECT Campaign_ID as id,
                   Campaign_Title as title,
                   Campaign_Organization as organization,
                   Campaign_Category as category,
                   Campaign_Description as description,
                   Campaign_Goal as goal,
                   Campaign_Raised as raised,
                   Campaign_Beneficiaries as beneficiaries,
                   Campaign_Location as location,
                   Campaign_Start_Date as startDate,
                   Campaign_End_Date as endDate,
                   Campaign_Status as status,
                   Campaign_Image as image
            FROM campaigns
            WHERE Campaign_Status IN ('active', 'urgent')
            ORDER BY Campaign_Status DESC, Campaign_ID ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $campaigns = $stmt->fetchAll();

    // Calculate days left and progress percentage
    foreach ($campaigns as &$c) {
        $c['goal']   = (float)$c['goal'];
        $c['raised'] = (float)$c['raised'];
        $c['progress'] = $c['goal'] > 0 ? round(($c['raised'] / $c['goal']) * 100) : 0;
        $c['daysLeft'] = $c['endDate']
            ? max(0, (int)ceil((strtotime($c['endDate']) - time()) / 86400))
            : null;
        $c['donors'] = 0; // placeholder — can join donations table later
    }

    echo json_encode(["status" => "success", "data" => $campaigns]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
