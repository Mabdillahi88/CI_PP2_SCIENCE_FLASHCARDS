/*jshint esversion: 6 */

// Contact Form Submission
document
  .getElementById("contactFormNew")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading feedback
    const submitButton = event.target.querySelector("button[type='submit']");
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    // Send form data via EmailJS
    emailjs.sendForm("service_sh3glh8", "template_p1j2t64", this).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert(
          "Thank you! Your message has been successfully sent. We’ll get back to you shortly."
        );

        // Reset the form and button after successful submission
        this.reset();
        submitButton.textContent = "Submit";
        submitButton.disabled = false;
      },
      (error) => {
        console.error("FAILED...", error);
        alert(
          "Oops! Something went wrong while sending your message. Please try again later."
        );

        // Reset button text and state on failure
        submitButton.textContent = "Submit";
        submitButton.disabled = false;
      }
    );
  });

// Responsive Navbar Functionality
function toggleNavbar() {
  const navbar = document.getElementById("myNavbar");
  navbar.classList.toggle("responsive"); // Toggle the "responsive" class
}
