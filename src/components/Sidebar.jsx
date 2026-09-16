function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        AgileFlow
      </h1>

      <nav className="space-y-3">

        <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-700">
          🏠 Dashboard
        </button>

        <p className="text-sm text-slate-400 mt-6">
          WORKSPACES
        </p>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700">
          📁 College Project
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700">
          📁 Development
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-700">
          + Create Workspace
        </button>

      </nav>

      <div className="absolute bottom-5">
        <button className="px-4 py-3 hover:bg-slate-700 rounded-lg">
          ⚙️ Settings
        </button>

        <button className="block px-4 py-3 hover:bg-slate-700 rounded-lg">
          🚪 Logout
        </button>
      </div>

    </aside>
  )
}

export default Sidebar