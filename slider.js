document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Show the first slide
    slides[currentSlide].classList.add('active');

    // Function to show next slide
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Event listener for Continue button
    document.getElementById('continue-btn').addEventListener('click', function() {
        const termsCheckbox = document.getElementById('terms-checkbox');

        if (termsCheckbox.checked) {
            // Redirect to another page when terms are accepted
            window.location.href = "register_login.html";
        } else {
            alert("Please accept the terms and conditions.");
        }
    });
});
