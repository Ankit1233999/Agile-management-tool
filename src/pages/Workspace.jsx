
function Workspace() {
  return (
    <div className="page">
      <h1>My Workspaces</h1>
      <p className="subtitle">Manage all your team workspaces.</p>

      <div className="workspace-grid">
        <div className="workspace-card">
          <h2>📁 College Project</h2>
          <p>Agile Management Tool</p>
          <button>Open Workspace</button>
        </div>

        <div className="workspace-card">
          <h2>💻 Development</h2>
          <p>Personal development workspace</p>
          <button>Open Workspace</button>
        </div>

        <div className="workspace-card create-card">
          <h2>＋ Create Workspace</h2>
          <p>Create a new workspace for your team.</p>
          <button>Create</button>
        </div>
      </div>
    </div>
  );
}

export default Workspace;