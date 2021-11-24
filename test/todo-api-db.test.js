import axios from "axios";
import pool from "../mysql-pool";
import todoApi from "../todo-api";
import taskService from "../task-service";

axios.defaults.adapter = require("axios/lib/adapters/http");
axios.defaults.baseURL = "http://localhost:3000";

const testData = [
    { id: 1, title: "Les leksjon", done: 1, description: '' },
    { id: 2, title: "Møt opp på forelesning", done: 0, description: ' '},
    { id: 3, title: "Gjør øving", done: 0, description: ' ' } 
];

let webServer;
beforeAll(() => webServer = todoApi.listen(3000));

beforeEach(async () => {
    const deleteActions = testData.map(task => taskService.delete(task.id));
    await Promise.all(deleteActions);

    const createActions = testData.map(task => taskService.create(task));
    await Promise.all(createActions);

});

afterAll(async () => {
    const deleteActions = [1, 2, 3, 4].map(id => taskService.delete(id));
    await Promise.all(deleteActions);
    
    pool.end();
    webServer.close();
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

    test("Fetch all tasks (500 Internal Server Error)", async () => {
        let actualGetAll = taskService.getAll;
        taskService.getAll = () => Promise.reject();

        await expect(() => axios.get("/api/v1/tasks"))
        .rejects
        .toThrow("Request failed with status code 500");

        taskService.getAll = actualGetAll;
    });

    test("Fetch task (404 Not Found)", async () => {
        try {
            const response = await axios.get("/api/v1/tasks/-1");
        } catch(error) {
            expect(error.response.status).toEqual(404);
        }
    });

    test("Fetch task (500 Internal Server error)", async () => {
        let actualGet = taskService.get;
        taskService.get = () => Promise.reject();

        await expect(() => axios.get("/api/v1/tasks/1"))
        .rejects
        .toThrow("Request failed with status code 500");

        taskService.get = actualGet;
    });
});

describe("Create new task (POST)", () => {
    test("Create new task (201 Created)", async () => {
        const newTask = { id: 4, title: "Ny oppgave", done: false, description: ' '  };
        const response = await axios.post("/api/v1/tasks", newTask);
        expect(response.status).toEqual(201);
        expect(response.headers.location).toEqual("tasks/4");
    });

    test("Create new task (400 Bad Request)", async () => {
        const newTaskMissingId = { title: 'Ny oppgave', done: false, description: ' '  };
        try {
            const response = await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch(error) {
            expect(error.response.status).toEqual(400);
        }
    });

    test("Create new task (500 Internal Server error)", async () => {
        const newTaskMissingId = { id: null, title: 'Ny oppgave', done: false, description: ' ' };
        try {
            const response = await axios.post("/api/v1/tasks", newTaskMissingId);
        } catch(error) {
            expect(error.response.status).toEqual(500);
        }
    });
});

describe("Delete task (DELETE)", () => {
    test("Delete task (200 OK)", async () => {
        const response = await axios.delete("/api/v1/tasks/2");
        expect(response.status).toEqual(200);
    });

    test("Delete task (500 Internal Server error)", async () => { 
        let actualDelete = taskService.delete;
        taskService.delete = () => Promise.reject();

        await expect(() => axios.delete("/api/v1/tasks/2"))
        .rejects
        .toThrow("Request failed with status code 500");

        taskService.delete = actualDelete;
    });
});
