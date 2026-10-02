function Navbar({ user }) {
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/90 px-6 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
          ⚡ AgileFlow Workspace
        </span>
        <span className="hidden md:inline text-xs text-slate-400">Plan, track, and deliver work together.</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full bg-slate-50 border border-slate-200/60 pl-1.5 pr-3 py-1 shadow-2xs">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2563eb] font-bold text-white text-xs shadow-xs">
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold leading-none text-slate-800">{user?.name}</p>
            <p className="text-[10px] font-medium text-slate-400 leading-tight mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

