<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $comment = strip_tags(trim($_POST["comment"]));
    $date = date('d.m.y H:i'); // Formatted date

    // Format the comment
    $formattedComment = "<div class='comment'><span class='time' data-name='" . strtolower($name) . "'>" . htmlspecialchars($date) . "</span> <strong class='name'>" . htmlspecialchars($name) . "</strong>: <span class='comment-text'>" . nl2br(htmlspecialchars($comment)) . "</span></div>\n";

    file_put_contents('comments.txt', $formattedComment, FILE_APPEND);
}

// Load and return all comments
if (file_exists('comments.txt')) {
    echo file_get_contents('comments.txt');
}
?>
