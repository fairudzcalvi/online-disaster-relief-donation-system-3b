<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Email/username and password are required"));
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT user_id, full_name, username, email, password_hash, donor_type, is_active 
              FROM users 
              WHERE (email = :identifier OR username = :identifier) 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":identifier", $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row['is_active'] == 0) {
            http_response_code(403);
            echo json_encode(array("success" => false, "message" => "Account is deactivated"));
            exit();
        }

        if (password_verify($data->password, $row['password_hash'])) {
            
            $token = bin2hex(random_bytes(32));

            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful",
                "data" => array(
                    "user" => array(
                        "id" => $row['user_id'],
                        "full_name" => $row['full_name'],
                        "username" => $row['username'],
                        "email" => $row['email'],
                        "donor_type" => $row['donor_type']
                    ),
                    "token" => $token
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Invalid credentials"));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Invalid credentials"));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Server error: " . $e->getMessage()));
}
?>