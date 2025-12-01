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
        console.log("CSV File Content:");
        console.log(data);
        console.log("End of CSV file content.");
    });
}

// Starting the server
app.listen(PORT, () => {
    console.log("Server started successfully on port:", PORT);
    console.log("Open your browser and visit http://localhost:" + PORT);

    // Calling the function to read the CSV file when the server starts
    readCSVFile();
});