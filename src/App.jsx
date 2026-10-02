import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import KanbanBoard from "./pages/KanbanBoard";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";


function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-slate-600 text-lg">
        Loading AgileFlow...
      </div>
    </div>
  );
}


function App() {
  const {
    user,
    token,
    isCheckingSession
  } = useAuth();

  // Landing page / Login / Register state
  const [authPage, setAuthPage] = useState("home");

  // Main pages
  const [view, setView] = useState("dashboard");

  // Workspace data
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // Board data
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Workspace creation
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);

  // Loading
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);

  // Error
  const [workspaceError, setWorkspaceError] = useState("");


  // --------------------------------
  // LOAD WORKSPACES
  // --------------------------------

  const loadWorkspaces = useCallback(async () => {
    if (!token) return;

    setLoadingWorkspaces(true);
    setWorkspaceError("");

    try {
      const data = await api.getWorkspaces(token);

      setWorkspaces(data);

      setSelectedWorkspace((current) => {
        return (
          data.find(
            (workspace) => workspace._id === current?._id
          ) ||
          current ||
          data[0] ||
          null
        );
      });

    } catch (error) {
      console.error(error);
      setWorkspaceError(
        error.message || "Failed to load workspaces"
      );

    } finally {
      setLoadingWorkspaces(false);
    }
  }, [token]);


  // --------------------------------
  // LOAD WORKSPACES WHEN LOGIN
  // --------------------------------

  useEffect(() => {
    if (!token) return;

    loadWorkspaces();
  }, [token, loadWorkspaces]);


  // --------------------------------
  // OPEN DASHBOARD
  // --------------------------------

  const openDashboard = useCallback(() => {
    setCreatingWorkspace(false);
    setView("dashboard");
  }, []);


  // --------------------------------
  // SELECT WORKSPACE
  // --------------------------------

  const selectWorkspace = useCallback((workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedBoard(null);
    setCreatingWorkspace(false);

    setView("workspace");
  }, []);


  // --------------------------------
  // CREATE WORKSPACE
  // --------------------------------

  const startCreateWorkspace = useCallback(() => {
    setCreatingWorkspace(true);
    setSelectedBoard(null);
    setView("workspace");
  }, []);


  // --------------------------------
  // WORKSPACE CREATED
  // --------------------------------

  const handleWorkspaceCreated = useCallback(
    (workspace) => {
      setWorkspaces((current) => [
        workspace,
        ...current
      ]);

      setCreatingWorkspace(false);
      setSelectedWorkspace(workspace);
      setSelectedBoard(null);

      setView("workspace");
    },
    []
  );


  // --------------------------------
  // WORKSPACE UPDATED
  // --------------------------------

  const handleWorkspaceUpdated = useCallback(
    (workspace) => {
      setWorkspaces((current) =>
        current.map((item) =>
          item._id === workspace._id
            ? workspace
            : item
        )
      );

      setSelectedWorkspace(workspace);
    },
    []
  );


  // --------------------------------
  // OPEN BOARD
  // --------------------------------

  const openBoard = useCallback((board) => {
    setSelectedBoard(board);
    setView("board");
  }, []);


  // --------------------------------
  // BACK TO WORKSPACE
  // --------------------------------

  const backToWorkspace = useCallback(() => {
    setSelectedBoard(null);
    setView("workspace");
  }, []);


  // --------------------------------
  // OPEN SETTINGS
  // --------------------------------

  const openSettings = useCallback(() => {
    setView("settings");
  }, []);


  // --------------------------------
  // SESSION LOADING
  // --------------------------------

  if (isCheckingSession) {
    return <LoadingScreen />;
  }


  // --------------------------------
  // PUBLIC LANDING SITE / LOGIN / REGISTER
  // --------------------------------

  if (!user) {
    if (authPage === "login") {
      return (
        <Login
          onRegister={() => setAuthPage("register")}
          onBackHome={() => setAuthPage("home")}
        />
      );
    }

    if (authPage === "register") {
      return (
        <Register
          onLogin={() => setAuthPage("login")}
          onBackHome={() => setAuthPage("home")}
        />
      );
    }

    return (
      <LandingPage
        onLogin={() => setAuthPage("login")}
        onRegister={() => setAuthPage("register")}
      />
    );
  }


  // --------------------------------
  // MAIN AGILEFLOW APPLICATION
  // --------------------------------

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <Sidebar
        workspaces={workspaces}
        selectedWorkspaceId={
          selectedWorkspace?._id
        }
        view={view}
        onDashboard={openDashboard}
        onKanbanBoard={openDashboard}
        onSelectWorkspace={selectWorkspace}
        onCreateWorkspace={
          startCreateWorkspace
        }
        onSettings={openSettings}
      />


      {/* MAIN AREA */}
      <div className="min-w-0 flex-1">

        {/* NAVBAR */}
        <Navbar user={user} />


        {/* ERROR MESSAGE */}
        {workspaceError && (
          <div className="mx-6 mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {workspaceError}
          </div>
        )}


        {/* ========================= */}
        {/* DASHBOARD */}
        {/* ========================= */}

        {view === "dashboard" && (
          <Dashboard
            user={user}
            workspaces={workspaces}
            loading={loadingWorkspaces}

            onOpenWorkspace={
              selectWorkspace
            }

            onCreateWorkspace={
              startCreateWorkspace
            }
          />
        )}


        {/* ========================= */}
        {/* WORKSPACE */}
        {/* ========================= */}

        {view === "workspace" && (
          <Workspace
            workspace={selectedWorkspace}
            token={token}

            onWorkspaceCreated={
              handleWorkspaceCreated
            }

            onWorkspaceUpdated={
              handleWorkspaceUpdated
            }

            onOpenBoard={openBoard}

            startCreate={
              creatingWorkspace
            }
          />
        )}


        {/* ========================= */}
        {/* KANBAN BOARD */}
        {/* ========================= */}

        {view === "board" &&
          selectedBoard && (
            <KanbanBoard
              board={selectedBoard}
              token={token}
              currentUser={user}
              onBack={
                backToWorkspace
              }
            />
          )}


        {/* ========================= */}
        {/* SETTINGS */}
        {/* ========================= */}

        {view === "settings" && (
          <Settings
            key={
              selectedWorkspace?._id ||
              "no-workspace"
            }

            workspace={
              selectedWorkspace
            }

            token={token}

            onWorkspaceUpdated={
              handleWorkspaceUpdated
            }

            onChooseWorkspace={() =>
              setView("workspace")
            }
          />
        )}

      </div>
    </div>
  );
}


export default App;