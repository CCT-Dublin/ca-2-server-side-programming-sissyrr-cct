// Importing the mysql2 module
const mysql = require("mysql2");

// Creating a connection pool to the MySQL database
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",        // Add your MySQL password if you have one
    database: "server_side_db"
});

// Function to test the database connection
function testConnection() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Error connecting to MySQL:", err);
            return;
        }
        console.log("=========================================");
        console.log("Database connection successful.");
        console.log("Connected to database: server_side_db");
        console.log("=========================================");
        connection.release();
    });
}

// Exporting the pool and testConnection function
module.exports = {
    pool,
    testConnection
};