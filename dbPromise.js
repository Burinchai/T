import mysql from 'mysql2/promise';

const dbPromise = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "activitydb"
});

export default dbPromise;
