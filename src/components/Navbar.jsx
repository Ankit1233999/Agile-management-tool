import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import NotificationDropdown from './NotificationDropdown';

function Navbar({ user }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.isRead).length);
        }
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };
    fetchNotifications();
  }, [user]);

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/90 px-6 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
          ⚡ AgileFlow Workspace
        </span>
        <span className="hidden md:inline text-xs text-slate-400">Plan, track, and deliver work together.</span>
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          onClick={() => setIsSearchOpen(true)}
          title="Search (Ctrl+K)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <NotificationDropdown 
          notifications={notifications} 
          setNotifications={setNotifications}
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
        />

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

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
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar;

