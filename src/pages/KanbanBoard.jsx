function KanbanBoard() {
  const columns = [
    {
      title: "To Do",
      tasks: ["Login Page", "Database Setup"],
    },
    {
      title: "In Progress",
      tasks: ["Dashboard UI", "Navbar"],
    },
    {
      title: "Done",
      tasks: ["React Setup", "GitHub Setup"],
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