<?php
require_once 'database.php';

echo "<h2>Database Connection Test</h2>";

try {
    $conn = getDBConnection();
    echo "<p style='color:green;'>Connection successful!</p>";
    echo "<p>Host: " . DB_HOST . "</p>";
    echo "<p>Database: " . DB_NAME . "</p>";
    echo "<p>User: " . DB_USER . "</p>";

    // Test a simple query
    $stmt = $conn->query("SELECT 1");
    echo "<p style='color:green;'>Query test passed.</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>❌ Connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
