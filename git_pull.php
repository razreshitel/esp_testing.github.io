<?php
$stored_hash = '6a30f630de10757c2efcde448c91d09746a44b6be1688992634996f76955a21f'; // Replace with your actual hashed password

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (hash('sha256', $_POST['password']) === $stored_hash) {
        echo "<pre>Starting update...</pre>";
        $output = shell_exec('git fetch origin && git reset --hard origin/main && git clean -fd 2>&1');
        echo "<pre>$output</pre>";
    } else {
        echo "<pre>Incorrect Password</pre>";
    }
}
?>

<form method="post">
    Password: <input type="password" name="password">
    <input type="submit" value="Update Repository">
</form>
