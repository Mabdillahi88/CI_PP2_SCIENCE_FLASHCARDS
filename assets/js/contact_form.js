document.getElementById("contactFormNew").addEventListener("submit", function (event) {
  event.preventDefault();

  const serviceID = "service_ucprvlr";
  const templateID = "template_nm94uz8";

  emailjs.sendForm(serviceID, templateID, this)
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
      alert("SUCCESS!");
      event.target.reset();  // This line resets the form
    }, (error) => {
      console.log("FAILED...", error);
      alert("FAILED...");
    });
});

function myFunction() {
  var x = document.getElementById("myNavbar");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}
