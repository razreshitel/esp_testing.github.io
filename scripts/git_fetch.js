document.getElementById('update-repo-btn').addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "scripts/update_repo.php", true); // Request to get the last update time
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var lastUpdateTime = this.responseText; // Response contains the last update time
            var password = prompt(lastUpdateTime + "\n\nPlease enter the password:");
            if (password != null) {
                var updateXhr = new XMLHttpRequest();
                updateXhr.open("POST", "scripts/update_repo.php", true);
                updateXhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                updateXhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        alert(this.responseText);
                    }
                };
                updateXhr.send("password=" + password);
            }
        }
    };
    xhr.send();
});