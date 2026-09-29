function Dashboard({ user, workspaces, loading, onOpenWorkspace, onCreateWorkspace }) {
  return (
    <main className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">WORKSPACE OVERVIEW</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user.name}</h1>
          <p className="mt-2 text-slate-600">Choose a workspace to create boards and organize your team’s work.</p>
        </div>
        <button onClick={onCreateWorkspace} className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700">+ New workspace</button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your workspaces…</p>
      ) : workspaces.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-800">Create your first workspace</h2>
          <p className="mx-auto mt-2 max-w-md text-slate-500">A workspace is the home for your team, boards, lists, and cards.</p>
          <button onClick={onCreateWorkspace} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">Create workspace</button>
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">My workspaces</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => (
              <article key={workspace._id} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-blue-100 font-bold text-blue-700">{workspace.name.charAt(0).toUpperCase()}</div>
                <h3 className="truncate text-lg font-semibold text-slate-800">{workspace.name}</h3>
                <p className="mt-2 h-10 overflow-hidden text-sm text-slate-500">{workspace.description || 'No description yet.'}</p>
                <p className="mt-4 text-xs text-slate-400">{workspace.members?.length || 1} member{workspace.members?.length === 1 ? '' : 's'}</p>
                <button onClick={() => onOpenWorkspace(workspace)} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">Open workspace →</button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Dashboard;
