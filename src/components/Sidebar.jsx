import { useAuth } from '../AuthContext';

function Sidebar({
  workspaces = [],
  selectedWorkspaceId,
  view,
  onDashboard,
  onSelectWorkspace,
  onCreateWorkspace,
  onSettings,
  onKanbanBoard,
}) {
  const { logout } = useAuth();

  const displayedWorkspaces = workspaces;

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/60 bg-white p-5 text-slate-700 select-none">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 cursor-pointer" onClick={onDashboard}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-lg font-bold text-white shadow-md shadow-blue-500/20">
          A
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">AgileFlow</span>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {/* Dashboard */}
        <button
          onClick={onDashboard}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
            view === 'dashboard'
              ? 'bg-[#edf4ff] text-[#2563eb]'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Dashboard</span>
        </button>

        {/* Kanban Board */}
        <button
          onClick={onKanbanBoard || onDashboard}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
            view === 'board'
              ? 'bg-[#edf4ff] text-[#2563eb] font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-base">📊</span>
          <span>Kanban Board</span>
        </button>

        {/* Workspaces */}
        <button
          onClick={() => {
            if (displayedWorkspaces && displayedWorkspaces.length > 0) {
              onSelectWorkspace(displayedWorkspaces[0]);
            } else {
              onCreateWorkspace();
            }
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
            view === 'workspace'
              ? 'bg-[#edf4ff] text-[#2563eb] font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-base">📁</span>
          <span>Workspaces</span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettings}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
            view === 'settings'
              ? 'bg-[#edf4ff] text-[#2563eb] font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="text-base">⚙️</span>
          <span>Settings</span>
        </button>

        {/* Workspaces section */}
        <div className="pt-6">
          <p className="mb-2 px-3.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            WORKSPACES
          </p>
          <div className="space-y-1">
            {displayedWorkspaces && displayedWorkspaces.length > 0 ? (
              displayedWorkspaces.map((workspace) => {
                const isSelected = selectedWorkspaceId === workspace._id && view === 'workspace';
                return (
                  <button
                    key={workspace._id}
                    onClick={() => onSelectWorkspace(workspace)}
                    className={`block w-full truncate rounded-lg px-3.5 py-2 text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-slate-100 font-semibold text-slate-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {workspace.name}
                  </button>
                );
              })
            ) : (
              <p className="px-3.5 py-1 text-xs text-slate-400 italic">No workspaces created yet</p>
            )}
          </div>

          <button
            onClick={onCreateWorkspace}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            + Create workspace
          </button>
        </div>
      </nav>

      {/* Footer / Account */}
      <div className="border-t border-slate-200/60 pt-4 space-y-1">
        <button
          onClick={onSettings}
          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-left text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        >
          Workspace settings
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

