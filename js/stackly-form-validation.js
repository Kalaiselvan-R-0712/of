(function () {
  "use strict";

  function showError(message, field) {
    window.alert(message);
    if (field) {
      field.focus({ preventScroll: false });
      field.setAttribute("aria-invalid", "true");
      field.addEventListener("input", function clearInvalid() {
        field.removeAttribute("aria-invalid");
        field.removeEventListener("input", clearInvalid);
      }, { once: true });
    }
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function redirectTo404() {
    window.location.assign("404.html");
  }

  // Footer newsletter: required email + strict basic email validation.
  document.querySelectorAll(".stackly-newsletter").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = form.querySelector('input[name="email"]');
      var value = email ? email.value.trim() : "";
      if (!value) return showError("Please enter your email address.", email);
      if (!validEmail(value)) return showError("Please enter a valid email address (example: name@example.com).", email);
      redirectTo404();
    });
  });

  // Contact form fields are validated in order; redirect only after all pass.
  var contactButton = document.getElementById("contact-submit");
  if (contactButton) {
    contactButton.addEventListener("click", function (event) {
      event.preventDefault();
      var name = document.getElementById("name");
      var email = document.getElementById("email");
      var phone = document.getElementById("Phone");
      var service = document.getElementById("subject");
      var message = document.getElementById("contact-message");
      var fields = [name, email, phone, service, message];
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i] || !fields[i].value.trim()) {
          var labels = ["Full Name", "Email Address", "Phone Number", "Service", "Message"];
          return showError("Please fill in the " + labels[i] + " field.", fields[i]);
        }
      }
      var cleanName = name.value.trim();
      if (!/^[\p{L}][\p{L}\p{M} .'-]{1,79}$/u.test(cleanName))
        return showError("Please enter a valid full name (at least 2 characters; letters only).", name);
      if (!validEmail(email.value.trim()))
        return showError("Please enter a valid email address (example: name@example.com).", email);
      var digits = phone.value.replace(/\D/g, "");
      if (!/^\+?[\d\s().-]+$/.test(phone.value.trim()) || digits.length < 7 || digits.length > 15)
        return showError("Please enter a valid phone number containing 7 to 15 digits.", phone);
      if (service.value.trim().length < 2)
        return showError("Please enter the service you are interested in.", service);
      if (message.value.trim().length < 10)
        return showError("Please enter a message with at least 10 characters.", message);
      redirectTo404();
    });
  }

  // Returning from 404 (including browser back/BFCache) always gives a fresh form.
  window.addEventListener("pageshow", function () {
    document.querySelectorAll(".stackly-newsletter").forEach(function (form) { form.reset(); });
    var contactFields = ["name", "email", "Phone", "subject", "contact-message"];
    contactFields.forEach(function (id) {
      var field = document.getElementById(id);
      if (field) { field.value = ""; field.removeAttribute("aria-invalid"); }
    });
  });
})();
