<?php
$stored_hash = '6a30f630de10757c2efcde448c91d09746a44b6be1688992634996f76955a21f';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (hash('sha256', $_POST['password']) === $stored_hash) {
        echo "Starting update...\n";
        $output = shell_exec('git fetch --all && git reset --hard origin/main && git clean -fd && echo "Update completed." 2>&1');
        file_put_contents('git.log', date("Y-m-d H:i:s") . " - Update executed\n", FILE_APPEND);
        echo nl2br($output);
    } else {
        echo "Incorrect Password";
    }
}
?>