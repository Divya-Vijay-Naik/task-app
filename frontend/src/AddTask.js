import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTask = ({ fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Debugging: Log the input values
    console.log("Submitting Task:", { title, description });

    // ✅ Validation: Prevent empty submissions
    if (!title.trim() || !description.trim()) {
      toast.error("❌ Title and description cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/tasks",
        { title, description },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Debugging: Log the server response
      console.log("Response from server:", response.data);

      toast.success("✅ Task added successfully!");
      setTitle("");
      setDescription("");
      fetchTasks(); // Refresh tasks list
    } catch (error) {
      console.error("❌ Error adding task:", error.response ? error.response.data : error);
      toast.error("❌ Failed to add task");
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Task</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddTask;
