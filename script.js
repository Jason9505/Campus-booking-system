const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-screen]");
const topLinks = document.querySelectorAll(".top-link");
const sideLinks = document.querySelectorAll(".side-link");
const forms = document.querySelectorAll("[data-form]");
const passwordInput = document.querySelector("#register-password");
const strengthMeter = document.querySelector(".strength");

const showScreen = (screenId) => {
  const target = document.getElementById(screenId);

  if (!target) {
    return;
  }

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  [...topLinks, ...sideLinks].forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const setMessage = (form, text, isError = false) => {
  const message = form.querySelector(".form-message");

  if (!message) {
    return;
  }

  message.textContent = text;
  message.classList.toggle("error", isError);
};

const getPasswordStrength = (value) => {
  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;

  if (!value) return "empty";
  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
};

const updatePasswordStrength = () => {
  if (!passwordInput || !strengthMeter) {
    return;
  }

  const strength = getPasswordStrength(passwordInput.value);
  const label = strengthMeter.querySelector("small");

  strengthMeter.dataset.strength = strength;
  label.textContent = strength === "empty"
    ? "Password strength"
    : `${strength.charAt(0).toUpperCase()}${strength.slice(1)} password`;
};

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage(form, "Please complete the required fields correctly.", true);
      return;
    }

    const formType = form.dataset.form;
    const messages = {
      "quick-book": "Search criteria accepted. Available resources are ready.",
      login: "Login successful for this interface preview.",
      register: "Registration preview completed. Verification email would be sent.",
      search: "Resources filtered successfully.",
      "create-booking": "Booking request submitted successfully.",
      resource: "Resource information saved.",
      reports: "Report generated. Export options are available.",
      policy: "Booking policy saved and audit log updated.",
    };

    setMessage(form, messages[formType] || "Action completed successfully.");

    if (formType === "quick-book" || formType === "search") {
      window.setTimeout(() => showScreen("search-resources"), 350);
    }

    if (formType === "create-booking") {
      window.setTimeout(() => showScreen("my-bookings"), 450);
    }
  });
});

document.querySelectorAll(".approve-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".approval-card");
    card.querySelector("p").textContent = "Approved. User notification has been sent.";
    button.textContent = "Approved";
    button.disabled = true;
    card.querySelector(".reject-btn").disabled = true;
  });
});

document.querySelectorAll(".reject-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".approval-card");
    card.querySelector("p").textContent = "Rejected. Remarks would be recorded for the user.";
    button.textContent = "Rejected";
    button.disabled = true;
    card.querySelector(".approve-btn").disabled = true;
  });
});

document.querySelectorAll(".tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
  });
});

passwordInput?.addEventListener("input", updatePasswordStrength);
updatePasswordStrength();
