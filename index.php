<!DOCTYPE html>
<html>
<head>
    <title>User Comments Page</title>
    <style>
        /* Add your CSS styling here */
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
        }
        .form-container, .comments-container {
            margin-top: 20px;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .form-container {
            float: left;
            width: 40%;
        }
        .comments-container {
            float: right;
            width: 50%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="form-container">
            <h2>Post a Comment</h2>
            <?php
            // Handle POST request and append comment to the file
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $name = strip_tags(trim($_POST["name"]));
                $comment = strip_tags(trim($_POST["comment"]));
                $date = date('Y-m-d H:i:s');

                // Format the comment
                $formattedComment = "<div><strong>" . htmlspecialchars($name) . "</strong> [" . htmlspecialchars($date) . "]: " . htmlspecialchars($comment) . "</div>\n";

                // Append the comment to the file
                file_put_contents('comments.txt', $formattedComment, FILE_APPEND);
            }
            ?>
            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <input type="text" name="name" placeholder="Your Name" required><br>
                <textarea name="comment" placeholder="Your Comment" required></textarea><br>
                <button type="submit">Post Comment</button>
            </form>
        </div>
        <div class="comments-container">
            <h2>Comments</h2>
            <?php
            if(file_exists('comments.txt')) {
                echo file_get_contents('comments.txt');
            }
            ?>
        </div>
    </div>
</body>
</html>
