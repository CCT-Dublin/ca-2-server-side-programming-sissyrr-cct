// Accessing the form
const form = document.querySelector("form");

// Adding submit event listener
form.addEventListener("submit", function (event) {

    // Prevent form submission until validation passes
    event.preventDefault();

    // Getting input values
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const eirCode = document.getElementById("eir_code").value.trim();

    // Validation patterns
    const nameRegex = /^[a-zA-Z0-9]{1,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const eircodeRegex = /^[a-zA-Z0-9]{7}$/;

    // Validation checks
    if (!nameRegex.test(firstName)) {
        alert("First name must contain only letters or numbers and be max 20 characters.");
        return;
    }

    if (!nameRegex.test(lastName)) {
        alert("Last name must contain only letters or numbers and be max 20 characters.");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return;
    }

    if (!eircodeRegex.test(eirCode)) {
        alert("Eircode must be alphanumeric, and exactly 7 characters.");
        return;
    }

    // If all validations pass
    alert("Form validation successful. Data ready to be submitted.");
    form.submit();
});