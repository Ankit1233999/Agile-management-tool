import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import KanbanBoard from "./pages/KanbanBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    if (page === "register") {
      return (
        <Register
          onRegister={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onRegister={() => setPage("register")}
      />
    );
  }

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