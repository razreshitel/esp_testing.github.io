<?php
// Your stored SHA256 hash
$storedHash = '6a30f630de10757c2efcde448c91d09746a44b6be1688992634996f76955a21f';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $receivedHash = $data['passwordHash'] ?? '';

    if ($receivedHash === $storedHash) {
        // Execute Git commands
        $output = shell_exec('git fetch origin && git reset --hard origin/main && git clean -fd 2>&1');
        echo "Commands executed successfully.\n" . $output;
    } else {
        echo "Invalid password.";
    }
} else {
    echo "Invalid request method.";
}
?>
