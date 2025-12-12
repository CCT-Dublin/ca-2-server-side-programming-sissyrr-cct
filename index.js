// Importing necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./database");

// Creating an Express application
const app = express();

//Setting the port number
const PORT = 3000;

// File path for the CSV file
const csvFilePath = path.join(__dirname, "data", "Personal_information.csv");

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

    // We now expect at least 5 columns: first_name, last_name, email, phone, eir_code
    if (columns.length < 5) {
        return { valid: false, error: "Not enough columns (expected at least 5)", line: lineNumber };
    }

    // Check if any column is missing or blank
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].trim().length === 0) {
            return { valid: false, error: "Missing value in column " + (i + 1), line: lineNumber };
        }
    }

    // If everything is fine
    return { valid: true, data: columns };
}

// Function to insert valid records into the database
function insertValidRecords(validRecords) {
    console.log("=========================================");
    console.log("Starting insertion of valid CSV records...");
    console.log("=========================================");

    validRecords.forEach((row, index) => {
        // Extract individual columns from the row
        const firstName = row[0].trim();
        const lastName = row[1].trim();
        const email = row[2].trim();
        const phone = row[3].trim();
        const eirCode = row[4].trim(); // New column

        const insertQuery = `
        INSERT INTO mysql_table (first_name, last_name, email, phone, eir_code)
        VALUES (?, ?, ?, ?, ?)
    `;

        db.pool.query(insertQuery, [firstName, lastName, email, phone, eirCode], (err, result) => {
            if (err) {
                console.log("Error inserting row", index + 1, ":", err);
                return;
            }
            console.log("Row", index + 1, "inserted successfully.");
        });
    });
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

        console.log("---- STARTING CSV VALIDATION ----");

        lines.forEach((row, index) => {
            const lineNumber = index + 1;

            // Skip header row
            if (index === 0) {
                console.log("Skipping header row.");
                return;
            }
            
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

        // Now call insertion function (Commit 6)
        insertValidRecords(validRecords);
    });
}


//starting the server
app.listen(PORT, () => {
    console.log("---- Server started on port:", PORT);
    console.log("---- Visit http://localhost:" + PORT);

    //checking database table structure
    db.checkAndCreateTable();

    //CSV reading logic
    readCSVFile();
});