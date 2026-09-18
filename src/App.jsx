import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    {/* Main application layout */}
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;