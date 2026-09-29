import { useState } from 'react';
import { api } from '../api';

function Settings({ workspace, token, onWorkspaceUpdated, onChooseWorkspace }) {
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);

  if (!workspace) {
    return (
      <main className="p-6 md:p-8">
        <section className="rounded-xl border border-dashed bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-800">Choose a workspace first</h1>
          <p className="mt-2 text-slate-500">Workspace details and invitations are managed from workspace settings.</p>
          <button onClick={onChooseWorkspace} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">Choose workspace</button>
        </section>
      </main>
    );
  }

  const saveWorkspace = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const updated = await api.updateWorkspace(workspace._id, { name, description }, token);
      onWorkspaceUpdated(updated);
      setNotice('Workspace settings saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const invite = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setInviting(true);
    try {
      const result = await api.inviteMember(workspace._id, { email: inviteEmail }, token);
      onWorkspaceUpdated(result.workspace);
      setInviteEmail('');
      setNotice('Member added to the workspace.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setInviting(false);
    }
  };

  return (
    <main className="max-w-4xl p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">WORKSPACE SETTINGS</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{workspace.name}</h1>
        <p className="mt-2 text-slate-600">Update workspace details and add existing AgileFlow users to the team.</p>
      </div>
      {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}

      <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Workspace information</h2>
        <form className="mt-5 space-y-4" onSubmit={saveWorkspace}>
          <div>
            <label htmlFor="settings-name" className="mb-2 block text-sm font-medium text-slate-700">Workspace name</label>
            <input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength="100" className="w-full max-w-xl rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="settings-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea id="settings-description" value={description} onChange={(event) => setDescription(event.target.value)} rows="4" maxLength="500" className="w-full max-w-xl rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Team members</h2>
        <div className="mt-4 divide-y">
          {(workspace.members || []).map((member) => (
            <div key={member.user?._id || member.user} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0"><p className="truncate font-medium text-slate-800">{member.user?.name || 'Team member'}</p><p className="truncate text-sm text-slate-500">{member.user?.email || ''}</p></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{member.role}</span>
            </div>
          ))}
        </div>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={invite}>
          <input type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} required placeholder="colleague@example.com" className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          <button disabled={inviting} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60">{inviting ? 'Adding…' : 'Add member'}</button>
        </form>
        <p className="mt-2 text-xs text-slate-500">The person must first register for AgileFlow with this email address.</p>
      </section>
    </main>
  );
}

export default Settings;
