// Login form validation
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate credentials
    if (username === "sb" && password === "123") {
        // Redirect to the dashboard (or wherever you want)
        window.location.href = "dashboard.html"; // Modify this to match your page
    } else {
        document.getElementById("errorMessage").textContent = "Invalid Username or Password!";
    }
});
// Function to read the uploaded CSV file
// Function to read the uploaded CSV file
