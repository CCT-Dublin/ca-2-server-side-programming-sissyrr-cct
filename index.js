// Importing necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./database");

// Creating an Express application
const app = express();

//Setting the port number
const PORT = 3000;

// Middleware section
// Parse form data
app.use(express.urlencoded({ extended: false }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Simple request logging middleware
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

// Content Security Policy (CSP) header
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'"
    );
    next();
});

// Cleaning input to prevent XSS
function cleanInput(input) {
    return input
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .trim();
}

// Server-side validation
function validateFormData(firstName, lastName, email, phone, eirCode) {
    const nameRegex = /^[a-zA-Z0-9]{1,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const eircodeRegex = /^[a-zA-Z0-9]{7}$/;

    if (!nameRegex.test(firstName)) {
        return "Invalid first name";
    }

    if (!nameRegex.test(lastName)) {
        return "Invalid last name";
    }

    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }

    if (!phoneRegex.test(phone)) {
        return "Phone number must be exactly 10 digits";
    }

    if (!eircodeRegex.test(eirCode)) {
        return "Invalid eircode format";
    }

    return null; // valid
}

// Routes
// Redirect root to form
app.get("/", (req, res) => {
    res.redirect("/form.html");
});

// Handle form submission
app.post("/submit", (req, res) => {

    console.log("Processing form submission...");

    // Cleaning inputs
    const firstName = cleanInput(req.body.first_name);
    const lastName = cleanInput(req.body.last_name);
    const email = cleanInput(req.body.email);
    const phone = cleanInput(req.body.phone);
    const eirCode = cleanInput(req.body.eir_code);

    // Server-side validation
    const validationError = validateFormData(
        firstName,
        lastName,
        email,
        phone,
        eirCode
    );

    if (validationError) {
        console.log("Validation failed:", validationError);
        res.status(400).send(validationError);
        return;
    }
    
    // Ensure database table exists before insert
    db.checkAndCreateTable();

    const insertQuery = `
        INSERT INTO user_data (first_name, last_name, email, phone, eir_code)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.pool.query(
        insertQuery,
        [firstName, lastName, email, phone, eirCode],
        (err, result) => {
            if (err) {
                console.log("Database insert error:", err);
                res.status(500).send("Database error occurred");
                return;
            }

            console.log("Form data inserted successfully.");
            res.send("Form submitted successfully!");
        }
    );
});


//starting the server
app.listen(PORT, () => {
    console.log("---- Server started on port:", PORT);
    console.log("---- Visit http://localhost:" + PORT);
});