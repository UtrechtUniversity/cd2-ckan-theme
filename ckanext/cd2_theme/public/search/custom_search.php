<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve POST variables
    $organization = $_POST["organization"];
    $q = $_POST["q"];

    // Check if q contains 'OR', 'or', or '||'
    if (strpos($q, 'OR') !== false || strpos($q, 'or') !== false || strpos($q, '||') !== false) {
        // Check if q contains ':'
        if (strpos($q, ':') === false) {
            // Append 'text:' to q
            $q = 'text:' . $q;
        }
    }

    // Build GET URL
    $url = '/dataset/?organization=' . urlencode($organization) . '&q=' . urlencode($q);

    // Redirect to GET URL
    header("Location: " . $url);
    exit();
}
?>