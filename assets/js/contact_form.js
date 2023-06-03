/*jshint esversion: 6 */

// Add event listener to the form submit button
document.getElementById("contactFormNew").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Email service and template identifiers
  const serviceID = "service_ucprvlr";
  const templateID = "template_nm94uz8";

  // Send the form data using emailjs library
  emailjs.sendForm(serviceID, templateID, this)
    .then((response) => {
      // Log success and show success alert
      console.log("SUCCESS!", response.status, response.text);
      alert("SUCCESS!");
      event.target.reset(); // Reset the form
    }, (error) => {
      // Log failure and show failure alert
      console.log("FAILED...", error);
      alert("FAILED...");
    });
});

// Toggle responsive class for the navbar
function myFunction() {
  var x = document.getElementById("myNavbar");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}
