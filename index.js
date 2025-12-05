// Importing necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");

// Creating an Express application
const app = express();

//Setting the port number
const PORT = 3000;

// File path for the CSV file
const csvFilePath = path.join(__dirname, "data", "person_info.csv");

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Basic route to test server response
app.get("/", (req, res) => {
    res.send("Server is running. Check the console output.");
});

function validateCSVRow(row, lineNumber) {
    // Removing extra spaces
    const trimmedRow = row.trim();

    // Ignoring empty lines
    if (trimmedRow.length === 0) {
        return { valid: false, error: "Empty row", line: lineNumber };
    }

    // Splitting row into columns
    const columns = trimmedRow.split(",");

    // Expecting at least 4 columns (example: first_name, last_name, email, phone, etc.)
    if (columns.length < 4) {
        return { valid: false, error: "Not enough columns", line: lineNumber };
    }

    // Check if any column is missing or blank
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].trim().length === 0) {
            return { valid: false, error: "Missing value in column " + (i + 1), line: lineNumber };
        }
    }

    // If everything is fine
    return { valid: true,  data: columns };
}

// Function to read the CSV file
function readCSVFile() {
    console.log("Reading CSV file from:", csvFilePath);

    // Using fs.readFile to read the CSV file asynchronously
    fs.readFile(csvFilePath, "utf8", (err, data) => {
        if (err) {
            console.log("Error in reading CSV file:", err);
            return;
        }

        console.log("CSV file read successfully.");

        // Splitting file content into lines
        const lines = data.split("\n");

        // Arrays to hold valid and invalid rows
        let validRecords = [];
        let invalidRecords = [];

        console.log("----------- STARTING CSV VALIDATION -----------");

        lines.forEach((row, index) => {
            const lineNumber = index + 1;
            const result = validateCSVRow(row, lineNumber);

            if (result.valid) {
                validRecords.push(result.data);
                console.log("Line", lineNumber, ": VALID");
            } else {
                invalidRecords.push(result);
                console.log("Line", lineNumber, ": ERROR -", result.error);
            }
        });

        console.log("---- VALIDATION COMPLETE ----");
        console.log("Total Valid Records:", validRecords.length);
        console.log("Total Invalid Records:", invalidRecords.length);

        if (invalidRecords.length > 0) {
            console.log("---- INVALID ROWS ----");
            invalidRecords.forEach((item) => {
                console.log("Line", item.line + ":", item.error);
            });
        }

        console.log("---- END OF PROCESSING ----");
    });
}


// Starting the server
app.listen(PORT, () => {
    console.log("Server started successfully on port:", PORT);
    console.log("Open your browser and visit http://localhost:" + PORT);

    // Calling the function to read the CSV file when the server starts
    readCSVFile();
});