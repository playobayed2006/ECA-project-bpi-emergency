import { DatabaseSync } from "node:sqlite";
import { Parser } from "json2csv";
const db = new DatabaseSync("data.db");

export const ping = (_req, res) => {
  res.json({ message: "Pong!" });
};

export const createStudent = (req, res) => {
  const {
    name,
    roll,
    phone,
    gender,
    department,
    semester,
    shift,
    faculty,
    sports,
  } = req.body;
  try {
    const checkRoll = db.prepare(`SELECT id FROM students WHERE roll = ?`);
    const isRoll = checkRoll.get(roll);

    if (isRoll) {
      return res.status(409).json({
        error: "Roll already exists",
      });
    }

    const insertStudent = db.prepare(
      `INSERT INTO students (name, roll, phone, gender, department, semester, shift, faculty, sports) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    const result = insertStudent.run(
      name,
      roll,
      phone,
      gender,
      department,
      semester,
      shift,
      faculty,
      sports,
    );

    res.status(200).json({
      id: result.lastInsertRowid,
      name,
      roll,
      phone,
      gender,
      department,
      semester,
      shift,
      faculty,
      sports,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudents = (req, res) => {
  const faculty = req.params.faculty;
  const readStudents = db.prepare(`SELECT * FROM students WHERE faculty = ?`);
  const result = readStudents.all(faculty);

  const fields = [
    { label: "Name", value: "name" },
    { label: "Gender", value: "gender" },
    { label: "Roll", value: "roll" },
    { label: "Semester", value: "semester" },
    { label: "Department", value: "department" },
    { label: "Shift", value: "shift" },
    { label: "Phone Number", value: (row) => `\t${row.phone}` },
    { label: "Sports", value: "sports" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(result);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${faculty}_students.csv"`,
  );

  res.status(200).send(csv);
};
