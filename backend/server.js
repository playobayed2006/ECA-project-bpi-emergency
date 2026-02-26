import express from "express";
import cors from "cors";
import { ping, createStudent, getStudents } from "./controllers/students.js";

const app = express();
app.use(express.json());

// Update CORS to allow your Netlify URL specifically (Security best practice)
app.use(cors()); 

// CHANGE: Use process.env.PORT to let Render choose the port
const PORT = process.env.PORT || 3000;

app.get("/ping", ping);
app.post("/", createStudent);
app.get("/:faculty", getStudents);

// CHANGE: Remove 'localhost' from the console log to avoid confusion on the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
