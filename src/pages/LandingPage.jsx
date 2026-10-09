import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Layout, Users, Lock, Rocket, MessageSquare, ArrowRight 
} from 'lucide-react';

function LandingPage({ onLogin, onRegister }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Agile<span className="text-indigo-400">Flow</span>
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Workflow</a>
            <a href="#technology" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Technology</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign in
            </button>
            <button onClick={onRegister} className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all backdrop-blur-sm">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AgileFlow 2.0 is here
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight mb-8">
            Manage projects. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Work better together.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10">
            A beautiful, intelligent workspace to manage your projects, organize tasks, and collaborate with your team in real-time.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onRegister} className="group relative px-8 py-4 rounded-xl bg-white text-[#0a0a0f] font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105">
              Create Free Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onLogin} className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all">
              Sign in to Dashboard
            </button>
          </motion.div>
        </motion.div>

        {/* Product Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-24 max-w-6xl mx-auto px-6 relative"
          id="workflow"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none translate-y-1/2" />
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 bg-[#0f0f16]">
            {/* Window Controls */}
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Fake Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-[500px]">
              <div className="hidden md:flex border-r border-white/10 bg-white/5 p-4 flex-col gap-2">
                <div className="flex items-center gap-2 px-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">A</div>
                  <span className="font-semibold text-slate-200">AgileFlow</span>
                </div>
                <div className="h-10 rounded bg-indigo-500/20 text-indigo-400 flex items-center px-3 text-sm font-medium border border-indigo-500/20">
                  <Layout className="w-4 h-4 mr-3" /> Kanban Board
                </div>
                <div className="h-10 rounded hover:bg-white/5 flex items-center px-3 text-sm font-medium text-slate-400 cursor-pointer transition-colors">
                  <Users className="w-4 h-4 mr-3" /> Team Workspaces
                </div>
                <div className="h-10 rounded hover:bg-white/5 flex items-center px-3 text-sm font-medium text-slate-400 cursor-pointer transition-colors">
                  <MessageSquare className="w-4 h-4 mr-3" /> Messages
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#0f0f16] to-[#0a0a0f] overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white">Website Redesign</h3>
                    <p className="text-sm text-slate-400 mt-1">Sprint 3 • 8 Active Tasks</p>
                  </div>
                  <div className="hidden sm:flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#0f0f16] bg-indigo-500 flex items-center justify-center text-xs font-bold text-white z-20">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#0f0f16] bg-violet-500 flex items-center justify-center text-xs font-bold text-white z-10">AS</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#0f0f16] bg-slate-700 flex items-center justify-center text-xs font-bold text-white z-0">+3</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* To Do */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300 text-sm">To Do</span>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">3</span>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 hover:border-indigo-500/30 transition-colors cursor-pointer group shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400">Design</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-orange-500/20 text-orange-400">Urgent</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 mb-4 group-hover:text-indigo-300 transition-colors">Create dark mode mockups</p>
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-3.5 h-3.5" /> 2</span>
                        <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">AS</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 hover:border-indigo-500/30 transition-colors cursor-pointer shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">Backend</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 mb-4">Setup websocket connection</p>
                      <div className="flex justify-between items-center text-slate-500">
                        <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-3.5 h-3.5" /> 0</span>
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">KT</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* In Progress */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span> In Progress
                      </span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">1</span>
                    </div>
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-4 shadow-[0_0_15px_rgba(99,102,241,0.15)] cursor-pointer hover:bg-indigo-500/20 transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300">Frontend</span>
                      </div>
                      <p className="text-sm font-medium text-white mb-4">Implement Spotlight search UI with animations</p>
                      <div className="flex justify-between items-center text-indigo-300/70">
                        <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-3.5 h-3.5" /> 5</span>
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">JD</div>
                      </div>
                    </div>
                  </div>

                  {/* Done */}
                  <div className="flex flex-col gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-400 text-sm">Done</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/10">2</span>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 cursor-default">
                      <p className="text-sm font-medium text-slate-400 line-through decoration-slate-500 mb-2">Initial repository setup</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 cursor-default">
                      <p className="text-sm font-medium text-slate-400 line-through decoration-slate-500 mb-2">Add Tailwind CSS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to ship faster</h2>
            <p className="text-slate-400 text-lg">Powerful features wrapped in a beautiful, intuitive interface. Designed for modern teams who move fast.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Real-Time Sync", desc: "Instantly see updates as your team moves cards. No refreshing required.", color: "text-amber-400", bg: "bg-amber-400/10" },
              { icon: Layout, title: "Flexible Boards", desc: "Organize tasks your way. Create custom columns and workflows.", color: "text-indigo-400", bg: "bg-indigo-400/10" },
              { icon: Users, title: "Team Workspaces", desc: "Keep projects organized with dedicated team spaces and permissions.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { icon: Lock, title: "Bank-Grade Security", desc: "Your data is encrypted and securely stored with JWT authentication.", color: "text-rose-400", bg: "bg-rose-400/10" },
              { icon: Rocket, title: "Lightning Fast", desc: "Optimized for speed. Navigate between boards instantly.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
              { icon: MessageSquare, title: "In-Context Chat", desc: "Discuss tasks right where the work happens. Keep context clear.", color: "text-violet-400", bg: "bg-violet-400/10" }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY ================= */}
      <section id="technology" className="py-24 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Built with a modern stack</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Socket.io", "Framer Motion"].map((tech) => (
              <div key={tech} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-white/10 hover:border-white/20 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your workflow?</h2>
          <p className="text-xl text-slate-400 mb-10">Join thousands of teams already using AgileFlow to ship better products.</p>
          <button onClick={onRegister} className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all scale-100 hover:scale-105">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-white">AgileFlow</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AgileFlow Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;