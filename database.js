// Importing the mysql2 module
const mysql = require("mysql2");

// Creating a connection pool to the MySQL database
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ca2_server"
});

// test the database connection and create table if not exists
function checkAndCreateTable() {
    console.log("Checking database table: user_data");

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        phone VARCHAR(20),
        eir_code VARCHAR(10)
    );
`;

    pool.query(createTableQuery, (err, results) => {
        if (err) {
            console.log("Error creating user_data:", err);
            return;
        }
        console.log("user_data is ready.");
    });
}

// Test connection immediately
pool.getConnection((err, conn) => {
    if (err) {
        console.error("MySQL Connection Error:", err);
    } else {
        console.log("MySQL Connected Successfully");
        conn.release();
        checkAndCreateTable();
    }
});

//exporting the pool and checkAndCreateTable function for use in other files
module.exports = {
    pool,
    checkAndCreateTable
};