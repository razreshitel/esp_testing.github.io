// Обработчик для кнопки
document.getElementById('updateButton').addEventListener('click', async () => {
    try {
        // Сначала запросим первые 5 строк из log.txt
        const logResponse = await fetch('update_repo.php?getLog=true');
        const logText = await logResponse.text();

        // Показываем пользователю первые 5 строк лога
        alert("Первые 5 строк из log.txt:\n" + logText);

        // Запрашиваем у пользователя пароль
        const password = prompt("Введите пароль для обновления:");

        if (password) {
            // Отправляем запрос на сервер с паролем
            const response = await fetch('update_repo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'password=' + encodeURIComponent(password)
            });

            const result = await response.text();
            alert(result);
        }
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        alert("Произошла ошибка. Попробуйте снова.");
    }
});
