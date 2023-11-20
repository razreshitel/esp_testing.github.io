<?php
// Check if the request is a POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $comment = $_POST["comment"];

    // Save the comment to a file or database (e.g., MySQL)
    // Example: Save to a file
    $file = "comments.txt";
    $content = "$name: $comment\n";
    file_put_contents($file, $content, FILE_APPEND);

    // Return a success response to the client
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>