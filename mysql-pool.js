import mysql from "mysql";

const pool = mysql.createPool({
    host: "mysql.stud.ntnu.no",
    connectionLimit: 1,
    user: "username_todo",
    password: "username_todo",
    database: "username_todo_dev",
});

export default pool;
