import mysql from "mysql";

const pool = mysql.createPool({
    host: "mysql.stud.ntnu.no",
    connectionLimit: 1,
    user: "brukernavn_todoapi",
    password: "brukernavn_todoapi",
    database: "brukernavn_todoapi_db_dev",
});

export default pool;
