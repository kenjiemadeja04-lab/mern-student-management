import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch(() => {
        alert("Failed to load students.");
      });
  }, []);

  const clearForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const addStudent = async () => {
    try {
      await axios.post(
        "http://localhost:5000/students",
        {
          name: name.trim(),
          course: course.trim(),
          age: Number(age)
        }
      );

      const response = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(response.data);
      clearForm();
    } catch (error) {
      console.error(error);
      alert("Failed to add or refresh students.");
    }
  };

  const editStudent = (student) => {
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditingId(student._id);
  };

  const updateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:5000/students/${editingId}`,
        {
          name: name.trim(),
          course: course.trim(),
          age: Number(age)
        }
      );

      const response = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(response.data);
      clearForm();
    } catch (error) {
      console.error(error);
      alert("Failed to update or refresh students.");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      const response = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(response.data);

      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete or refresh students.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !course.trim()) {
      alert("Please enter a name and course.");
      return;
    }

    if (editingId === null) {
      addStudent();
    } else {
      updateStudent();
    }
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>
        {editingId === null
          ? "Add Student"
          : "Edit Student"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
          />
        </div>

        <div>
          <label htmlFor="course">Course: </label>

          <input
            id="course"
            type="text"
            value={course}
            onChange={(event) => {
              setCourse(event.target.value);
            }}
            required
          />
        </div>

        <div>
          <label htmlFor="age">Age: </label>

          <input
            id="age"
            type="number"
            min="0"
            step="1"
            value={age}
            onChange={(event) => {
              setAge(event.target.value);
            }}
            required
          />
        </div>

        <button type="submit">
          {editingId === null
            ? "Add Student"
            : "Update Student"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button
            type="button"
            onClick={() => editStudent(student)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => deleteStudent(student._id)}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;