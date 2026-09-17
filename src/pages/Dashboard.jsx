function Dashboard() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Ankit 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your projects and tasks from one place.
        </p>
      </div>

      {/* Workspaces */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          My Workspaces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-lg font-semibold">
              College Project
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Agile Management Tool
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-lg font-semibold">
              Development
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Personal development projects
            </p>
          </div>

        </div>
      </div>

      {/* Recent Boards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Boards
        </h2>

        <div className="bg-white rounded-xl shadow-sm border">

          <div className="p-5 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Website Development
              </h3>
              <p className="text-sm text-gray-500">
                College Project
              </p>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              Active
            </span>
          </div>

          <div className="p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Project 2
              </h3>
              <p className="text-sm text-gray-500">
                Agile Management Tool
              </p>
            </div>

            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
              In Progress
            </span>
          </div>

        </div>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Task Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">To Do</p>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">In Progress</p>
            <p className="text-3xl font-bold mt-2">4</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500">Completed</p>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;