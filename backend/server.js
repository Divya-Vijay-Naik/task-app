const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// ✅ Middleware (ORDER MATTERS)
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend access
app.use(express.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// ✅ MySQL Connection Pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Divya@005", // ⚠️ Change to your real password
    database: "task_manager",
    connectionLimit: 10,
});

// ✅ Check MySQL Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1); // Exit if DB fails
    }
    console.log("✅ Connected to MySQL Database");
    connection.release();
});

// ✅ Debug Middleware to Check Requests
app.use((req, res, next) => {
    console.log(`🔹 Incoming Request: ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log("🔹 Request Body:", req.body);
    }
    next();
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the Task API!");
});

// ✅ Add a New Task
app.post("/tasks", (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ error: "Title and description are required!" });
    }

    const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";
    pool.query(query, [title, description], (err, result) => {
        if (err) {
            console.error("❌ Error inserting task:", err.message);
            return res.status(500).json({ error: "Failed to add task" });
        }
        res.status(201).json({ message: "✅ Task added successfully!", taskId: result.insertId });
    });
});

// ✅ Get All Tasks
app.get("/tasks", (req, res) => {
    const query = "SELECT * FROM tasks";
    pool.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching tasks:", err.message);
            return res.status(500).json({ error: "Failed to retrieve tasks" });
        }
        res.json(results);
    });
});

// ✅ Get a Single Task by ID
app.get("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM tasks WHERE id = ?";
    
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching task:", err.message);
            return res.status(500).json({ error: "Failed to retrieve task" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(results[0]);
    });
});

// ✅ Update a Task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required!" });
    }

    const query = "UPDATE tasks SET title = ?, description = ? WHERE id = ?";
    pool.query(query, [title, description, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating task:", err.message);
            return res.status(500).json({ error: "Failed to update task" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "✅ Task updated successfully!" });
    });
});

// ✅ Delete a Task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting task:", err.message);
            return res.status(500).json({ error: "Failed to delete task" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "✅ Task deleted successfully!" });
    });
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
