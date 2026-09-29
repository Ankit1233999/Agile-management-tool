import { useEffect, useState } from 'react';
import { api } from '../api';

function CreateWorkspace({ token, onWorkspaceCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const workspace = await api.createWorkspace({ name, description }, token);
      onWorkspaceCreated(workspace);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-6 md:p-8">
      <section className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">NEW WORKSPACE</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Create a workspace</h1>
        <p className="mt-2 text-slate-600">Invite your team after creating it, then add a board to start planning work.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div>
            <label htmlFor="workspace-name" className="mb-2 block text-sm font-medium text-slate-700">Workspace name</label>
            <input id="workspace-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength="100" placeholder="e.g. Product Team" className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="workspace-description" className="mb-2 block text-sm font-medium text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea id="workspace-description" value={description} onChange={(event) => setDescription(event.target.value)} rows="4" maxLength="500" placeholder="What does this team work on?" className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Creating…' : 'Create workspace'}</button>
        </form>
      </section>
    </main>
  );
}

function Workspace({ workspace, token, onWorkspaceCreated, onWorkspaceUpdated, onOpenBoard, startCreate }) {
  const [detail, setDetail] = useState(null);
  const [boards, setBoards] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingBoard, setCreatingBoard] = useState(false);

  useEffect(() => {
    if (!workspace?._id || startCreate) return undefined;
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      Promise.all([
        api.getWorkspace(workspace._id, token),
        api.getWorkspaceBoards(workspace._id, token),
      ])
        .then(([loadedWorkspace, loadedBoards]) => {
          if (!active) return;
          setDetail(loadedWorkspace);
          setBoards(loadedBoards);
          onWorkspaceUpdated(loadedWorkspace);
        })
        .catch((requestError) => active && setError(requestError.message))
        .finally(() => active && setLoading(false));
    }, 0);
    return () => { active = false; clearTimeout(timer); };
  }, [workspace?._id, token, startCreate, onWorkspaceUpdated]);

  if (!workspace || startCreate) {
    return <CreateWorkspace token={token} onWorkspaceCreated={onWorkspaceCreated} />;
  }

  const createBoard = async (event) => {
    event.preventDefault();
    if (!boardTitle.trim()) return;
    setError('');
    setCreatingBoard(true);
    try {
      const result = await api.createBoard({ title: boardTitle, workspaceId: workspace._id }, token);
      setBoards((current) => [result.board, ...current]);
      setBoardTitle('');
      onOpenBoard(result.board);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingBoard(false);
    }
  };

  const renameBoard = async (board) => {
    const title = window.prompt('Board name', board.title);
    if (!title?.trim() || title.trim() === board.title) return;
    try {
      const updated = await api.updateBoard(board._id, { title }, token);
      setBoards((current) => current.map((item) => item._id === board._id ? updated : item));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeBoard = async (board) => {
    if (!window.confirm(`Delete “${board.title}” and all of its lists and cards?`)) return;
    try {
      await api.deleteBoard(board._id, token);
      setBoards((current) => current.filter((item) => item._id !== board._id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const activeWorkspace = detail || workspace;
  return (
    <main className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">WORKSPACE</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{activeWorkspace.name}</h1>
          <p className="mt-2 text-slate-600">{activeWorkspace.description || 'No description yet. Open settings to add one.'}</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">{activeWorkspace.members?.length || 1} team member{activeWorkspace.members?.length === 1 ? '' : 's'}</div>
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Create a board</h2>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={createBoard}>
          <input value={boardTitle} onChange={(event) => setBoardTitle(event.target.value)} maxLength="100" required placeholder="e.g. Website redesign" className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          <button disabled={creatingBoard} className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{creatingBoard ? 'Creating…' : 'Create board'}</button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Boards</h2>
        {loading ? <p className="text-slate-500">Loading boards…</p> : boards.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-8 text-center text-slate-500">No boards yet. Create one to get the default To Do, In Progress, and Done lists.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {boards.map((board) => (
              <article key={board._id} className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-blue-600">{board.status}</p>
                <h3 className="mt-2 truncate text-lg font-semibold text-slate-800">{board.title}</h3>
                <div className="mt-5 flex items-center gap-4 text-sm">
                  <button onClick={() => onOpenBoard(board)} className="font-semibold text-blue-600 hover:text-blue-800">Open board</button>
                  <button onClick={() => renameBoard(board)} className="text-slate-500 hover:text-slate-800">Rename</button>
                  <button onClick={() => removeBoard(board)} className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Workspace;
