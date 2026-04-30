<?php
// Token verification middleware - include this in protected endpoints
function verifyAdminToken($conn) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized: No token provided"]);
        exit;
    }

    $token = substr($authHeader, 7);

    $stmt = $conn->prepare("SELECT id, username, name FROM admins WHERE token = :token AND active = 1 LIMIT 1");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Unauthorized: Invalid or expired token"]);
        exit;
    }

    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>
