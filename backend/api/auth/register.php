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

if (empty($data->full_name) || empty($data->email) || empty($data->password) || empty($data->donor_type)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "All fields are required"));
    exit();
}

if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid email format"));
    exit();
}

if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Password must be at least 6 characters"));
    exit();
}

if (!in_array($data->donor_type, ['individual', 'organization'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid donor type"));
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();


    $check_query = "SELECT user_id FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($check_query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(array("success" => false, "message" => "Email already exists"));
        exit();
    }


    $username = isset($data->username) ? $data->username : explode('@', $data->email)[0];
    

    $check_username_query = "SELECT user_id FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($check_username_query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $username = $username . rand(100, 999);
    }


    $insert_query = "INSERT INTO users (full_name, username, email, password_hash, donor_type) 
                     VALUES (:full_name, :username, :email, :password_hash, :donor_type)";
    
    $stmt = $db->prepare($insert_query);
    
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    
    $stmt->bindParam(":full_name", $data->full_name);
    $stmt->bindParam(":username", $username);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password_hash", $hashed_password);
    $stmt->bindParam(":donor_type", $data->donor_type);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "User registered successfully",
            "data" => array(
                "full_name" => $data->full_name,
                "email" => $data->email,
                "username" => $username,
                "donor_type" => $data->donor_type
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Unable to register user"));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Server error: " . $e->getMessage()));
}
?>