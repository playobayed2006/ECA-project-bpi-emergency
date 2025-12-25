import express from "express";
import cors from "cors";
import { ping, createStudent, getStudents } from "./controllers/students.js";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

app.get("/ping", ping);
app.post("/", createStudent);
app.get("/:faculty", getStudents);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
