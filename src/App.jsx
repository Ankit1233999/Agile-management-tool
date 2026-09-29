import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Workspace from './pages/Workspace';

function LoadingScreen() {
  return <div className="min-h-screen grid place-items-center text-slate-600">Loading AgileFlow…</div>;
}

function App() {
  const { user, token, isCheckingSession } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  const [view, setView] = useState('dashboard');
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');

  const loadWorkspaces = useCallback(async () => {
    if (!token) return;
    setLoadingWorkspaces(true);
    setWorkspaceError('');
    try {
      const data = await api.getWorkspaces(token);
      setWorkspaces(data);
      setSelectedWorkspace((current) => data.find((workspace) => workspace._id === current?._id) || current || data[0] || null);
    } catch (error) {
      setWorkspaceError(error.message);
    } finally {
      setLoadingWorkspaces(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    const timer = setTimeout(() => { void loadWorkspaces(); }, 0);
    return () => clearTimeout(timer);
  }, [token, loadWorkspaces]);

  const selectWorkspace = useCallback((workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedBoard(null);
    setCreatingWorkspace(false);
    setView('workspace');
  }, []);

  const handleWorkspaceCreated = useCallback((workspace) => {
    setWorkspaces((current) => [workspace, ...current]);
    setCreatingWorkspace(false);
    selectWorkspace(workspace);
  }, [selectWorkspace]);

  const handleWorkspaceUpdated = useCallback((workspace) => {
    setWorkspaces((current) => current.map((item) => item._id === workspace._id ? workspace : item));
    setSelectedWorkspace(workspace);
  }, []);

  const openBoard = useCallback((board) => {
    setSelectedBoard(board);
    setView('board');
  }, []);

  if (isCheckingSession) return <LoadingScreen />;

  if (!user) {
    return authPage === 'register'
      ? <Register onLogin={() => setAuthPage('login')} />
      : <Login onRegister={() => setAuthPage('register')} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        workspaces={workspaces}
        selectedWorkspaceId={selectedWorkspace?._id}
        view={view}
        onDashboard={() => setView('dashboard')}
        onSelectWorkspace={selectWorkspace}
        onCreateWorkspace={() => { setCreatingWorkspace(true); setView('workspace'); }}
        onSettings={() => setView('settings')}
      />

      <div className="min-w-0 flex-1">
        <Navbar user={user} />
        {workspaceError && <div className="mx-6 mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{workspaceError}</div>}
        {view === 'dashboard' && (
          <Dashboard
            user={user}
            workspaces={workspaces}
            loading={loadingWorkspaces}
            onOpenWorkspace={selectWorkspace}
            onCreateWorkspace={() => { setCreatingWorkspace(true); setView('workspace'); }}
          />
        )}
        {view === 'workspace' && (
          <Workspace
            workspace={selectedWorkspace}
            token={token}
            onWorkspaceCreated={handleWorkspaceCreated}
            onWorkspaceUpdated={handleWorkspaceUpdated}
            onOpenBoard={openBoard}
            startCreate={creatingWorkspace}
          />
        )}
        {view === 'board' && selectedBoard && (
          <KanbanBoard
            board={selectedBoard}
            token={token}
            onBack={() => setView('workspace')}
          />
        )}
        {view === 'settings' && (
          <Settings
            key={selectedWorkspace?._id || 'no-workspace'}
            workspace={selectedWorkspace}
            token={token}
            onWorkspaceUpdated={handleWorkspaceUpdated}
            onChooseWorkspace={() => setView('workspace')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
