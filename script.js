function submitComment() {
    var xhr = new XMLHttpRequest();
    var formData = new FormData(document.getElementById("commentForm"));

    xhr.open("POST", "submit_comment.php", true);
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById("commentsList").innerHTML = this.responseText;
            document.getElementById("commentForm").reset();
            updateCommentsStyle(); // Update styles after submitting a comment
        }
    }
    xhr.send(formData);
    return false; // Prevent page refresh
}

document.addEventListener('DOMContentLoaded', function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "submit_comment.php", true);
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById("commentsList").innerHTML = this.responseText;
            updateCommentsStyle(); // Update styles after initial page load
        }
    }
    xhr.send();
});


function hashStringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

function updateCommentsStyle() {
    document.querySelectorAll('.comment .name').forEach(function(elem) {
        var name = elem.parentNode.querySelector('.time').getAttribute('data-name');
        elem.style.color = hashStringToColor(name);
    });
}
