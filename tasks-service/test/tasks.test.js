import request from "supertest";
import mongoose from "mongoose";
import app from "../src/index.js";

// Conectar antes de correr tests
beforeAll(async () => {
  const MONGO_TEST_URI = "mongodb://localhost:27017/tasks_test";
  await mongoose.connect(MONGO_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cerrar conexión después
afterAll(async () => {
  await mongoose.connection.close();
});

// Prueba: obtener tareas (GET /tasks)
describe("Tasks API", () => {
  it("debería devolver un array de tareas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debería crear una nueva tarea", async () => {
    const newTask = { title: "Test tarea", description: "Prueba con Jest" };
    const res = await request(app).post("/tasks").send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test tarea");
  });
});
