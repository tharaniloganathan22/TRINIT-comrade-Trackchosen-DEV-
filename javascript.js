document.getElementById('continue-btn').addEventListener('click', function() {
    console.log('Button clicked'); // Check if click event is firing
    window.location.href = "intro_slider.html"; // Redirect to intro slider page
});

document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const responseData = await fetch('/register_tutor', {
        method: 'POST',
        body: formData
    }).then(response => response.json());

    if (responseData.message) {
        alert(responseData.message);
        if (responseData.message === "Registered successfully!") {
            window.location.href = "/tutor_home.html"; // Redirect to tutor home page on successful registration
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Display welcome message with registered name for a few seconds
    const registeredName = "John Doe"; // Replace with the registered name
    const welcomeMessage = document.createElement('div');
    welcomeMessage.textContent = `Welcome, ${registeredName}!`;
    welcomeMessage.classList.add('welcome-message');
    document.body.appendChild(welcomeMessage);
    
    setTimeout(function() {
        welcomeMessage.style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
});

function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function logout() {
    // Redirect to the registration option page
    window.location.href = "/registration_options.html"; // Replace with your registration option page URL
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
