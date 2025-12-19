import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data.db");

// Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    roll TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    gender TEXT,
    department TEXT,
    semester TEXT,
    shift TEXT,
    faculty TEXT,
    sports TEXT
  );
`);

console.log("Database and table created.");
