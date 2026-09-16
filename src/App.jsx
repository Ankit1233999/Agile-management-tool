import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Settings Page */}
        <Settings />

      </div>

    </div>
  );
}

export default App;