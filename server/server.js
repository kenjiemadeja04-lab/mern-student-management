const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// READ
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve students."
        });
    }
});

// CREATE
app.post("/students", async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            course: req.body.course,
            age: req.body.age
        });

        await student.save();

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Failed to add student."
        });
    }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                course: req.body.course,
                age: req.body.age
            },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update student."
        });
    }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json({
            message: "Student deleted successfully."
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete student."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});