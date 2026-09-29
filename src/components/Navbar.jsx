function Navbar({ user }) {
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="text-sm text-slate-500">Plan, track, and deliver work together.</div>
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 font-bold text-white">{initial}</div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
