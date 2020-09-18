import axios from "axios";
import pool from "../mysql-pool";
import todoApi from "../todo-api";
import taskService from "../task-service";

axios.defaults.adapter = require("axios/lib/adapters/http");
axios.defaults.baseURL = "http://localhost:3000";

jest.mock("../mysql-pool", () => {
    const mysql = require("mysql");
    return mysql.createPool({
        host: "mysql.stud.ntnu.no",
        connectionLimit: 1,
        user: "username_todo",
        password: "username_todo",
        database: "username_todo_test",
    });
});

const testData = [
    { id: 1, title: "Les leksjon", done: 1 },
    { id: 2, title: "Møt opp på forelesning", done: 0 },
    { id: 3, title: "Gjør øving", done: 0 } 
];

let webServer;
beforeAll(done => webServer = todoApi.listen(3000, () => done()));

beforeEach(async () => {
    await taskService.delete(1);
    await taskService.delete(2);
    await taskService.delete(3);

    await taskService.create(testData[0]);
    await taskService.create(testData[1]);
    await taskService.create(testData[2]);
});

afterAll(async (done) => {
    await taskService.delete(1);
    await taskService.delete(2);
    await taskService.delete(3);
    await taskService.delete(4);

    webServer.close(() => pool.end(() => done()));
});

describe("Fetch tasks (GET)", () => {
    test("Fetch all tasks (200 OK)", async () => {
        const response = await axios.get("/api/v1/tasks");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testData);
    });

    test("Fetch task (200 OK)", async () => {
        const expected = [testData[0]];
        const response = await axios.get("/api/v1/tasks/1");

        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    });

    test.skip("Fetch all tasks (500 Internal Server Error)", async () => {
        //todo
    });

    test.skip("Fetch task (404 Not Found)", async () => {
        //todo
    });

    test.skip("Fetch task (500 Internal Server error)", async () => {
        //todo
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false };
        const response = await axios.post("/api/v1/tasks", newTask);
        expect(response.status).toEqual(201);
        expect(response.headers.location).toEqual("tasks/4");
    });

    test.skip("Create new task (400 Bad Request)", async () => {
        //todo
    });

    test.skip("Create new task (500 Internal Server error)", async () => {
        //todo
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        const response = await axios.delete("/api/v1/tasks/2");
        expect(response.status).toEqual(200);
    });
});
