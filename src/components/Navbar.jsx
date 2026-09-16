function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-80 px-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        <button className="text-xl">
          🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>

          <span className="font-medium text-gray-700">
            Ankit
          </span>
        </div>

      </div>

    </header>
  )
}

export default Navbar