import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Layout, CreditCard, ChevronRight } from 'lucide-react';

function SearchModal({ isOpen, onClose, onSelectBoard }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ cards: [], boards: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setResults({ cards: [], boards: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ cards: [], boards: [] });
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#11111a] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-white/10">
              <Search className="w-5 h-5 text-indigo-500" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-lg"
                placeholder="Search projects, boards, cards..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button 
                onClick={onClose}
                className="flex items-center justify-center px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 flex justify-center items-center gap-3 text-slate-500 dark:text-slate-400">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Search className="w-5 h-5 opacity-50" />
                  </motion.div>
                  <span>Searching across your workspace...</span>
                </div>
              ) : (
                <div className="p-2">
                  {results.boards.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Boards</h3>
                      {results.boards.map(board => (
                        <div 
                          key={board._id}
                          className="group px-3 py-3 mx-1 flex items-center justify-between rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors"
                          onClick={() => {
                            onClose();
                            if (onSelectBoard) onSelectBoard(board);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                              <Layout className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{board.title}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {results.cards.length > 0 && (
                    <div>
                      <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cards</h3>
                      {results.cards.map(card => (
                        <div 
                          key={card._id}
                          className="group px-3 py-3 mx-1 flex items-center justify-between rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors"
                          onClick={() => {
                            onClose();
                            if (onSelectBoard) onSelectBoard(card.board);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{card.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">{card.board?.title || 'Unknown Board'}</span>
                                <span className="text-slate-400 dark:text-slate-600">•</span>
                                <span>{card.list?.title || 'Unknown List'}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}

                  {query.trim() && results.boards.length === 0 && results.cards.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-2">
                        <Search className="w-6 h-6 opacity-50" />
                      </div>
                      <p className="text-sm">No results found for <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span></p>
                      <p className="text-xs opacity-70">Try searching for something else.</p>
                    </div>
                  )}
                  
                  {!query.trim() && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                      <div className="flex gap-2 mb-2">
                        <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center gap-1">
                          <Layout className="w-5 h-5 text-indigo-400" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Boards</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center gap-1">
                          <CreditCard className="w-5 h-5 text-emerald-400" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Cards</span>
                        </div>
                      </div>
                      <p className="text-sm">Start typing to search your workspace...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0f]/50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm font-sans">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm font-sans">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm font-sans text-[10px]">ENTER</kbd> to select</span>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">AgileFlow Search</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
