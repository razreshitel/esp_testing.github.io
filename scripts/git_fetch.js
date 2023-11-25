document.getElementById('update-repo-btn').addEventListener('click', function() {
    var password = prompt("Please enter the password:");
    if (password != null) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "update_repo.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
            }
        };
        xhr.send("password=" + password);
    }
});