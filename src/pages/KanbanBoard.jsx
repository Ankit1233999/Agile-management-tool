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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Kanban Board
          </h1>
          <p className="text-gray-500">
            Manage your project tasks
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
          className="w-80 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addTask}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-200 rounded-xl p-4 min-h-[400px]"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {column.title}
            </h2>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <p className="font-medium text-gray-800 mb-3">
                      {task.title}
                    </p>

                    <div className="flex gap-2">
                      {column.id !== "todo" && (
                        <button
                          onClick={() => moveTask(task.id, "todo")}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          To Do
                        </button>
                      )}

                      {column.id !== "progress" && (
                        <button
                          onClick={() => moveTask(task.id, "progress")}
                          className="text-xs px-2 py-1 bg-blue-100 rounded"
                        >
                          Progress
                        </button>
                      )}

                      {column.id !== "done" && (
                        <button
                          onClick={() => moveTask(task.id, "done")}
                          className="text-xs px-2 py-1 bg-green-100 rounded"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;