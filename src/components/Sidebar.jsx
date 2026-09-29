import { useAuth } from '../AuthContext';

function Sidebar({
  workspaces,
  selectedWorkspaceId,
  view,
  onDashboard,
  onSelectWorkspace,
  onCreateWorkspace,
  onSettings,
}) {
  const { logout } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-900 p-5 text-white">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">AgileFlow</h1>
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <button onClick={onDashboard} className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${view === 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>Dashboard</button>
        <p className="mb-2 mt-6 px-2 text-xs font-semibold tracking-wider text-slate-400">WORKSPACES</p>
        {workspaces.map((workspace) => (
          <button key={workspace._id} onClick={() => onSelectWorkspace(workspace)} className={`w-full truncate rounded-lg px-4 py-2.5 text-left text-sm transition ${selectedWorkspaceId === workspace._id && view !== 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            {workspace.name}
          </button>
        ))}
        <button onClick={onCreateWorkspace} className="w-full rounded-lg px-4 py-3 text-left text-sm text-blue-200 transition hover:bg-slate-800">+ Create workspace</button>
      </nav>
      <div className="space-y-1 border-t border-slate-700 pt-4">
        <button onClick={onSettings} className="w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-slate-800">Workspace settings</button>
        <button onClick={logout} className="w-full rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800">Log out</button>
      </div>
    </aside>
  );
}

export default Sidebar;
