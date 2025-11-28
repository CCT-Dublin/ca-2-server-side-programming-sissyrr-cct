// Importing necessary modules
const express = require("express");
const path = require("path");

// Creating an Express application
const app = express();

//Setting the port number
const PORT = 3000;

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Basic route to test server
app.get("/", (req, res) => {
    res.send("Server is running.");
});

// Starting the server
app.listen(PORT, () => {
    console.log("=========================================");
    console.log("Server started successfully on port:", PORT);
    console.log("Open your browser and visit http://localhost:" + PORT);
    console.log("=========================================");
});