import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />
        <KanbanBoard />
      </div>
    </div>
  );
}

export default App;