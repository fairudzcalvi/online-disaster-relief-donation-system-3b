<?php
require_once '../config/database.php';

$conn = getDBConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    $username = $data->username;
    $password = $data->password;

    // Query admin user
    $query = "SELECT id, username, password, name FROM admins WHERE username = :username AND active = 1 LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($password, $row['password'])) {
            // Generate simple token
            $token = bin2hex(random_bytes(32));
            
            // Store token in database
            $updateQuery = "UPDATE admins SET token = :token, last_login = NOW() WHERE id = :id";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bindParam(":token", $token);
            $updateStmt->bindParam(":id", $row['id']);
            $updateStmt->execute();

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "token" => $token,
                "admin" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "name" => $row['name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username and password required"]);
}
?>