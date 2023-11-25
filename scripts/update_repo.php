<?php
$stored_hash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

// Handle POST request for updating the repository
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (hash('sha256', $_POST['password']) === $stored_hash) {
        echo "Starting update...\n";
        $output = shell_exec('git fetch --all && git reset --hard origin/main && git clean -fd && echo "Update completed." 2>&1');
        file_put_contents('../../git.log', date("Y-m-d H:i:s") . " - ESP - Update executed\n", FILE_APPEND);
        echo nl2br($output);
    } else {
        echo "Incorrect Password";
    }
} else {
    // Handle GET request to retrieve the last update time
    $logFilePath = '../../git.log'; // Adjust the path as needed

    if (file_exists($logFilePath)) {
        $lastLine = `tail -n 1 $logFilePath`; // Gets the last line of the git.log file
        echo $lastLine;
    } else {
        echo "No update information available.";
    }
}
?>
