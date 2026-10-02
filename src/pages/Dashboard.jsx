import { useState } from 'react';

function Dashboard({ user, workspaces = [], loading, onOpenWorkspace, onCreateWorkspace }) {
  // Local task state so the board is immediately interactive and matches the screenshot perfectly
  const [tasks, setTasks] = useState([
    {
      id: 't-1',
      title: 'Setup authentication',
      description: 'Configure secure JWT authentication',
      status: 'todo',
      tag: 'Backend',
      comments: 4,
    },
    {
      id: 't-2',
      title: 'Design dashboard',
      description: 'Create responsive workspace UI',
      status: 'todo',
    },
    {
      id: 't-3',
      title: 'Real-Time Sync',
      description: 'Sync board changes with team members instantly.',
      status: 'in-progress',
      tag: '⚡ Socket.io',
      assignees: [
        { name: 'Alex', bg: 'bg-blue-600', initial: 'A' },
        { name: 'Sarah', bg: 'bg-indigo-600', initial: 'S' },
      ],
      isHighlighted: true,
    },
    {
      id: 't-4',
      title: 'GitHub Setup',
      description: 'Repository configured successfully.',
      status: 'done',
      completed: true,
    },
    {
      id: 't-5',
      title: 'Kanban UI',
      description: 'Interactive sprint board layout created.',
      status: 'done',
      completed: true,
    },
  ]);

  // Modal state for "+ Add task"
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [newTaskTag, setNewTaskTag] = useState('');

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const totalTasks = tasks.length;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'No description provided.',
      status: newTaskStatus,
      tag: newTaskTag.trim() || (newTaskStatus === 'in-progress' ? '⚡ Socket.io' : 'Feature'),
      completed: newTaskStatus === 'done',
      assignees: newTaskStatus === 'in-progress' ? [
        { name: 'User', bg: 'bg-blue-600', initial: user?.name?.charAt(0).toUpperCase() || 'U' }
      ] : undefined,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskTag('');
    setShowAddModal(false);
  };

  const moveTask = (taskId, targetStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: targetStatus,
              completed: targetStatus === 'done',
              isHighlighted: targetStatus === 'in-progress',
            }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-4 sm:p-6 lg:p-8 select-none">
      {/* Top Address / Window Header Pill (Exact UI look as screenshot) */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between rounded-xl border border-slate-200/70 bg-white/80 px-4 py-2 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
        </div>
        <div className="rounded-md border border-slate-200/60 bg-slate-50 px-5 py-1 text-xs font-medium font-mono text-slate-400">
          agileflow.local
        </div>
        <div className="w-12"></div>
      </div>

      {/* Main Board Container */}
      <main className="mx-auto max-w-7xl rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        {/* Board Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold tracking-wider text-[#2563eb] uppercase">
              WORKSPACE
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Agile Development
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Sprint board • {totalTasks} active tasks
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span>+</span> Add task
          </button>
        </div>

        {/* 3 Columns Sprint Board Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ==================== TO DO COLUMN ==================== */}
          <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-[#f8fafc] p-4 min-h-[480px]">
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800">To Do</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/80 text-xs font-bold text-slate-600">
                {todoTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3.5 flex-1">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-xl border border-slate-200/70 bg-white p-4.5 shadow-xs transition hover:border-slate-300 hover:shadow-md cursor-pointer"
                  onClick={() => moveTask(task.id, 'in-progress')}
                  title="Click to move to In Progress"
                >
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  <p className="mt-1 text-xs font-normal text-slate-500 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {task.tag ? (
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#2563eb]">
                        {task.tag}
                      </span>
                    ) : (
                      <div />
                    )}

                    {task.comments ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <span>💬</span>
                        <span>{task.comments}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Move →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== IN PROGRESS COLUMN ==================== */}
          <div className="flex flex-col rounded-2xl border border-blue-100 bg-[#f4f7ff]/70 p-4 min-h-[480px]">
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800">In Progress</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {inProgressTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3.5 flex-1">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl bg-white p-4.5 shadow-xs transition cursor-pointer ${
                    task.isHighlighted
                      ? 'border-2 border-[#2563eb]/80 shadow-sm ring-2 ring-blue-100/50'
                      : 'border border-slate-200/70 hover:shadow-md'
                  }`}
                  onClick={() => moveTask(task.id, 'done')}
                  title="Click to move to Done"
                >
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>IN PROGRESS</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                  <p className="mt-1 text-xs font-normal text-slate-500 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {task.tag && (
                      <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                        {task.tag}
                      </span>
                    )}

                    {task.assignees ? (
                      <div className="flex -space-x-1">
                        {task.assignees.map((userObj, idx) => (
                          <div
                            key={idx}
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${userObj.bg} text-[10px] font-bold text-white ring-2 ring-white`}
                            title={userObj.name}
                          >
                            {userObj.initial}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-blue-600 font-semibold">Complete →</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== DONE COLUMN ==================== */}
          <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-[#f8fafc] p-4 min-h-[480px]">
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800">Done</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                {doneTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3.5 flex-1">
              {doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200/70 bg-white p-4.5 shadow-xs transition hover:shadow-md cursor-pointer"
                  onClick={() => moveTask(task.id, 'todo')}
                  title="Click to reset to To Do"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-500 font-bold text-sm">✓</span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-700">
                        {task.title}
                      </h3>
                      <p className="mt-1 text-xs font-normal text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Add New Task</h2>
            <p className="mt-1 text-xs text-slate-500">
              Create a task for the Agile Development sprint board.
            </p>

            <form onSubmit={handleAddTask} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth2"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe task scope or requirements"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Status Column
                  </label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Tag / Technology
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend, Socket.io"
                    value={newTaskTag}
                    onChange={(e) => setNewTaskTag(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563eb] px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
