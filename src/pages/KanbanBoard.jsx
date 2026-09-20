import { useState } from "react";

function KanbanBoard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create project structure",
      status: "todo",
    },
    {
      id: 2,
      title: "Build dashboard UI",
      status: "progress",
    },
    {
      id: 3,
      title: "Setup GitHub repository",
      status: "done",
    },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask,
      status: "todo",
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const moveTask = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const columns = [
    {
      id: "todo",
      title: "To Do",
    },
    {
      id: "progress",
      title: "In Progress",
    },
    {
      id: "done",
      title: "Done",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Kanban Board
      </h1>

      <p className="text-gray-600 mb-8">
        Manage your project tasks
      </p>

      {/* Add Task */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="Enter new task..."
          className="px-4 py-2 border rounded-lg w-80 bg-white"
        />

        <button
          onClick={addTask}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.title}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              {column.title}
            </h2>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task}
                  className="bg-gray-100 p-4 rounded-lg border"
                >
                  <p className="font-medium text-gray-700">
                    {task}
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full py-2 rounded-lg border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
              + Add Card
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;