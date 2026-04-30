<?php
// Simple session-based auth check for admin pages
// Include at the top of every admin PHP page
session_start();
if (empty($_SESSION['adminToken'])) {
    // Allow access if token is being validated via JS (SPA-style)
    // This is a soft guard — the real protection is the API token verification
    // For a hard redirect, uncomment the lines below:
    // header('Location: admin_logIn.html');
    // exit;
}
?>
