const mysql = require('mysql2/promise');

async function setupDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', 
            database: 'db_outdoor'
        });
        return connection;
    } catch (error) {
        console.error("Database Error:", error.message);
        process.exit(1);
    }
}

module.exports = setupDb;