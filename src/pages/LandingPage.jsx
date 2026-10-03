function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-white">
                  A
                </span>
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Agile<span className="text-indigo-600">Flow</span>
                </h1>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Project Management
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Features
              </a>

              <a
                href="#workflow"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Workflow
              </a>

              <a
                href="#technology"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Technology
              </a>
            </nav>

            {/* BUTTONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={onLogin}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
              >
                Sign in
              </button>

              <button
                onClick={onRegister}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
              >
                Get Started
              </button>
            </div>

          </div>
        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">

          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Real-Time Collaborative Workspace
            </div>


            {/* Heading */}
            <h2 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
              Manage projects.
              <br />

              <span className="text-indigo-600">
                Work better together.
              </span>
            </h2>


            {/* Description */}
            <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-500 leading-relaxed">
              AgileFlow gives your team one simple workspace to manage
              projects, organize tasks, collaborate in real time, and
              deliver work faster.
            </p>


            {/* HERO BUTTONS */}
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">

              <button
                onClick={onRegister}
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
              >
                Create Free Workspace
                <span className="ml-2">→</span>
              </button>

              <button
                onClick={onLogin}
                className="px-8 py-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                Sign in
              </button>

            </div>


            {/* TRUST ITEMS */}
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span>✓ Kanban Boards</span>
              <span>✓ Real-Time Updates</span>
              <span>✓ Team Collaboration</span>
              <span>✓ Secure Access</span>
            </div>

          </div>


          {/* ================= PRODUCT PREVIEW ================= */}
          <div
            id="workflow"
            className="mt-20 relative"
          >

            <div className="absolute inset-0 bg-indigo-100/50 blur-3xl rounded-full" />

            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 overflow-hidden">

              {/* Browser top */}
              <div className="h-12 px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                </div>

                <div className="hidden sm:block px-6 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-400">
                  agileflow.local
                </div>

                <div className="w-16" />
              </div>


              {/* APP PREVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] min-h-[430px]">

                {/* SIDEBAR */}
                <aside className="hidden md:block border-r border-slate-200 bg-slate-50 p-5">

                  <div className="flex items-center gap-2 mb-8">

                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>

                    <span className="font-bold text-slate-800">
                      AgileFlow
                    </span>

                  </div>


                  <div className="space-y-2">

                    <div className="px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium">
                      🏠 Dashboard
                    </div>

                    <div className="px-3 py-2.5 rounded-lg text-slate-500 text-sm hover:bg-white transition">
                      📊 Kanban Board
                    </div>

                    <div className="px-3 py-2.5 rounded-lg text-slate-500 text-sm hover:bg-white transition">
                      📁 Workspaces
                    </div>

                    <div className="px-3 py-2.5 rounded-lg text-slate-500 text-sm hover:bg-white transition">
                      ⚙️ Settings
                    </div>

                  </div>


                  <div className="mt-10">

                    <p className="px-3 text-[10px] uppercase tracking-wider text-slate-400 mb-3">
                      Workspaces
                    </p>

                    <div className="px-3 py-2 text-sm text-slate-500">
                      College Project
                    </div>

                    <div className="px-3 py-2 text-sm text-slate-500">
                      Development
                    </div>

                  </div>

                </aside>


                {/* BOARD */}
                <div className="p-6 bg-white">

                  {/* Board heading */}
                  <div className="flex items-center justify-between mb-7">

                    <div>
                      <p className="text-xs text-indigo-600 font-semibold mb-1">
                        WORKSPACE
                      </p>

                      <h3 className="text-xl font-bold text-slate-900">
                        Agile Development
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        Sprint board • 8 active tasks
                      </p>
                    </div>

                    <button className="hidden sm:block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition">
                      + Add task
                    </button>

                  </div>


                  {/* COLUMNS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* TODO */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                      <div className="flex items-center justify-between mb-4">

                        <span className="text-sm font-bold text-slate-700">
                          To Do
                        </span>

                        <span className="px-2 py-1 rounded-full bg-slate-200 text-xs text-slate-500">
                          3
                        </span>

                      </div>


                      <div className="space-y-3">

                        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">

                          <p className="text-sm font-semibold text-slate-800">
                            Setup authentication
                          </p>

                          <p className="text-xs text-slate-400 mt-2">
                            Configure secure JWT authentication
                          </p>

                          <div className="flex justify-between items-center mt-4">

                            <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[10px] font-medium">
                              Backend
                            </span>

                            <span className="text-xs text-slate-400">
                              💬 4
                            </span>

                          </div>

                        </div>


                        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">

                          <p className="text-sm font-semibold text-slate-800">
                            Design dashboard
                          </p>

                          <p className="text-xs text-slate-400 mt-2">
                            Create responsive workspace UI
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* IN PROGRESS */}
                    <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4">

                      <div className="flex items-center justify-between mb-4">

                        <span className="text-sm font-bold text-slate-700">
                          In Progress
                        </span>

                        <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs">
                          2
                        </span>

                      </div>


                      <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm">

                        <div className="flex items-center gap-2 mb-2">

                          <span className="w-2 h-2 rounded-full bg-indigo-600" />

                          <span className="text-[10px] text-indigo-600 font-semibold">
                            IN PROGRESS
                          </span>

                        </div>

                        <p className="text-sm font-semibold text-slate-800">
                          Real-Time Sync
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                          Sync board changes with team members instantly.
                        </p>

                        <div className="mt-4 flex items-center justify-between">

                          <span className="text-[10px] text-indigo-600 font-medium">
                            ⚡ Socket.io
                          </span>

                          <div className="flex -space-x-2">

                            <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                              A
                            </div>

                            <div className="w-6 h-6 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                              S
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* DONE */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                      <div className="flex items-center justify-between mb-4">

                        <span className="text-sm font-bold text-slate-700">
                          Done
                        </span>

                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs">
                          3
                        </span>

                      </div>


                      <div className="space-y-3">

                        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">

                          <div className="flex items-center gap-2">

                            <span className="text-emerald-600">
                              ✓
                            </span>

                            <p className="text-sm font-semibold line-through text-slate-400">
                              GitHub Setup
                            </p>

                          </div>

                          <p className="text-xs text-slate-400 mt-2">
                            Repository configured successfully.
                          </p>

                        </div>


                        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">

                          <div className="flex items-center gap-2">

                            <span className="text-emerald-600">
                              ✓
                            </span>

                            <p className="text-sm font-semibold line-through text-slate-400">
                              Kanban UI
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="border-t border-slate-200 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="max-w-2xl mx-auto text-center mb-16">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Powerful Features
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              Everything your team needs
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              Simple tools to plan projects, manage tasks, and keep
              your entire team aligned.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {/* CARD 1 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Real-Time Collaboration
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Keep your entire team updated with real-time board
                changes and project activity.
              </p>

            </div>


            {/* CARD 2 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mb-6">
                📋
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Kanban Boards
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Organize your team's work using simple and powerful
                Kanban boards.
              </p>

            </div>


            {/* CARD 3 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6">
                👥
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Team Workspaces
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Create dedicated workspaces for different projects
                and teams.
              </p>

            </div>


            {/* CARD 4 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl mb-6">
                🔐
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Secure Access
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Keep your project and workspace information protected
                with secure authentication.
              </p>

            </div>


            {/* CARD 5 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-6">
                🚀
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Fast Workflow
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Move tasks through your workflow and clearly see
                what needs to happen next.
              </p>

            </div>


            {/* CARD 6 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition">

              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-6">
                💬
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Team Discussions
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed">
                Keep conversations connected to your tasks and
                projects.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= TECHNOLOGY ================= */}
      <section
        id="technology"
        className="bg-slate-50 border-t border-slate-200"
      >

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="max-w-4xl mx-auto text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Technology
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              Built with modern technology
            </h2>

            <p className="text-slate-500 mt-4">
              A modern technology stack designed for collaborative
              project management.
            </p>


            <div className="mt-10 flex flex-wrap justify-center gap-3">

              {[
                "React",
                "Tailwind CSS",
                "Node.js",
                "Express",
                "MongoDB",
                "Socket.io",
                "JWT",
                "Redis",
              ].map((tech) => (

                <span
                  key={tech}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition"
                >
                  {tech}
                </span>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-white border-t border-slate-200">

        <div className="max-w-4xl mx-auto px-6 py-24 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-600/20">
            A
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mt-6">
            Ready to organize your work?
          </h2>

          <p className="max-w-xl mx-auto text-slate-500 mt-5">
            Create your AgileFlow workspace and bring your projects,
            tasks, and team collaboration together.
          </p>

          <button
            onClick={onRegister}
            className="mt-8 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            Create Your Workspace
            <span className="ml-2">→</span>
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </div>

              <div>

                <p className="font-bold text-slate-800">
                  Agile<span className="text-indigo-600">Flow</span>
                </p>

                <p className="text-xs text-slate-400">
                  Real-Time Collaborative Workspace
                </p>

              </div>

            </div>


            <div className="flex items-center gap-6 text-sm text-slate-500">

              <button
                onClick={onLogin}
                className="hover:text-indigo-600 transition"
              >
                Sign in
              </button>

              <button
                onClick={onRegister}
                className="hover:text-indigo-600 transition"
              >
                Create account
              </button>

            </div>


            <p className="text-xs text-slate-400">
              © 2026 AgileFlow
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;