function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
              <span className="text-xl font-black text-white">A</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Agile<span className="text-blue-500">Flow</span>
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#workflow" className="hover:text-white transition">Kanban Engine</a>
            <a href="#tech" className="hover:text-white transition">Real-Time Sync</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={onRegister}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Real-Time Collaborative Workspace
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
          Agile project management engineered for <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">high-velocity teams</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Manage sprint backlogs, dynamic Kanban boards, live task updates, card comments, and real-time Socket.io synchronization with zero latency.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRegister}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition text-base"
          >
            Create Your Workspace
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/80 px-8 py-4 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition text-base"
          >
            Sign In to Existing Account
          </button>
        </div>

        {/* MOCKUP PREVIEW */}
        <div className="mt-16 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-500">AgileFlow Board &mdash; Real-Time Socket Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-200 text-sm">To Do</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">2</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <p className="text-xs font-semibold text-slate-200">Setup JWT Socket Handshakes</p>
                  <p className="text-[11px] text-slate-500 mt-1">Implement secure socket authentication token validation</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="rounded bg-blue-500/20 text-blue-400 px-1.5 py-0.5">Security</span>
                    <span>💬 3</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <p className="text-xs font-semibold text-slate-200">Design Redis Cache Layer</p>
                  <p className="text-[11px] text-slate-500 mt-1">Optimize DB reads for high-traffic boards</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-200 text-sm">In Progress</span>
                <span className="rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-xs">1</span>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-3 ring-1 ring-blue-500/20">
                <p className="text-xs font-semibold text-blue-200">Real-Time Board Broadcasts</p>
                <p className="text-[11px] text-slate-400 mt-1">Socket room synchronization for card movements</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-blue-400 font-mono">⚡ Live Syncing</span>
                  <div className="flex -space-x-1">
                    <div className="h-5 w-5 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center border border-slate-900">A</div>
                    <div className="h-5 w-5 rounded-full bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center border border-slate-900">S</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-200 text-sm">Done</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-xs">2</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 opacity-80">
                  <p className="text-xs font-semibold text-slate-300 line-through">Kanban Drag & Drop Engine</p>
                  <p className="text-[11px] text-slate-500 mt-1">Smooth column reordering and card positioning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20 border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything your team needs to collaborate</h2>
          <p className="mt-4 text-slate-400">Built with modern tech stack: React, Node.js, Express, MongoDB, and Socket.io.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400 mb-5">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Socket Sync</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every card movement, creation, title edit, and deletion broadcasts instantly to all team members active in the board room.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-400 mb-5">
              📋
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Kanban Drag & Drop</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Intuitive column drag and drop powered by `@hello-pangea/dnd` with optimistic UI updates for instant feedback.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-400 mb-5">
              💬
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Card Discussions & Typing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Comment threads on every card with author tracking and real-time typing indicators when teammates write updates.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 AgileFlow. Real-Time Collaborative Workspace.</p>
          <div className="flex items-center gap-4 font-medium text-slate-400">
            <button onClick={onLogin} className="hover:text-white transition">Sign In</button>
            <span>&bull;</span>
            <button onClick={onRegister} className="hover:text-white transition">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
