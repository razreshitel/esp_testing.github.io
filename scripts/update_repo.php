<?php
// Хеш пароля (замените на свой SHA-256 хеш)
$storedPasswordHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';

// Путь к файлу log.txt
$logFilePath = '../log.txt';

// Проверяем, запрашиваются ли только первые 5 строк лога
if (isset($_GET['getLog']) && $_GET['getLog'] === 'true') {
    if (file_exists($logFilePath)) {
        $logFile = file($logFilePath);
        $firstFiveLines = array_slice($logFile, 0, 5);
        echo implode("", $firstFiveLines);
    } else {
        echo "Файл log.txt не найден.";
    }
    exit;
}

// Проверка пароля при POST-запросе
$inputPassword = isset($_POST['password']) ? hash('sha256', $_POST['password']) : '';

if ($inputPassword !== $storedPasswordHash) {
    echo "Неверный пароль.";
    exit;
}

// Обновление репозитория
echo "Пароль верен. Обновляем репозиторий...\n";
exec("git fetch --all && git reset --hard origin/main 2>&1", $output, $returnCode);

if ($returnCode === 0) {
    echo "Репозиторий успешно обновлен.";
} else {
    echo "Ошибка при обновлении репозитория:\n" . implode("\n", $output);
}
?>
