function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Workspace Settings
      </h1>

      <p className="text-gray-600 mb-8">
        Manage your workspace and team members.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-5">
          Workspace Information
        </h2>

        <label className="block text-sm font-medium mb-2">
          Workspace Name
        </label>

        <input
          type="text"
          placeholder="Agile Management Tool"
          className="w-full max-w-xl px-4 py-3 border rounded-lg mb-5 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium mb-2">
          Workspace Description
        </label>

        <textarea
          rows="4"
          placeholder="Enter workspace description"
          className="w-full max-w-xl px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-5">
          Team Members
        </h2>

        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <p className="font-medium">Ankit</p>
            <p className="text-sm text-gray-500">
              ankit@example.com
            </p>
          </div>

          <span className="text-sm text-gray-500">
            Admin
          </span>
        </div>

        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Invite Member
        </button>
      </div>

      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Save Changes
      </button>

    </div>
  );
}

export default Settings;