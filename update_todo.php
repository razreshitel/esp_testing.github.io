<?php
// Function to log messages
function writeToLog($message) {
    file_put_contents("log.txt", date("Y-m-d H:i:s") . ": " . $message . "\n", FILE_APPEND);
}

writeToLog("Request received");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        echo "No data received";
        exit;
    }

    // Read the first line from the existing file
    if (($firstLine = @file('to-do.csv', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)[0]) === false) {
        echo "Error reading the existing file";
        exit;
    }

    // Prepare the data to write
    $fileContent = $firstLine . "\n";
    $lastRowIndex = count($data) - 1;
    foreach ($data as $index => $row) {
        $fileContent .= implode(',', array_map('str_putcsv', $row));
        if ($index !== $lastRowIndex) {
            $fileContent .= "\n";
        }
    }

    // Write to the file
    if (file_put_contents('to-do.csv', $fileContent) === false) {
        echo "Error writing to the file";
        exit;
    }

    echo "To-do list updated successfully!";
} else {
    echo "Invalid request method";
}

// Helper function to format a CSV field (enclose in quotes if necessary)
function str_putcsv($input) {
    // Modify this function as needed for CSV formatting
    return $input;
}
?>
