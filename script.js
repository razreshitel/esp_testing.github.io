<script>
document.getElementById("commentForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Send the formData to the server using AJAX
    // Example: You can use the Fetch API or jQuery.ajax
    fetch("/submit_comment.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Comment submitted successfully!");
            // You can update the page or display a success message
        } else {
            alert("Error submitting comment. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
</script>