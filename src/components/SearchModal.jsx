import { useState, useEffect } from 'react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-lg"
            placeholder="Search for cards or boards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium" onClick={onClose}>ESC</button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Searching...</div>
          ) : (
            <>
              {results.boards.length > 0 && (
                <div className="mb-4">
                  <h3 className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Boards</h3>
                  {results.boards.map(board => (
                    <div 
                      key={board._id}
                      className="px-4 py-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        onClose();
                        if (onSelectBoard) onSelectBoard(board);
                      }}
                    >
                      <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {board.title.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{board.title}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {results.cards.length > 0 && (
                <div>
                  <h3 className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cards</h3>
                  {results.cards.map(card => (
                    <div 
                      key={card._id}
                      className="px-4 py-3 hover:bg-slate-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        onClose();
                        if (onSelectBoard) onSelectBoard(card.board);
                      }}
                    >
                      <div className="text-sm font-medium text-slate-700">{card.title}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">in {card.board?.title}</span>
                        <span>List: {card.list?.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {query.trim() && results.boards.length === 0 && results.cards.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No results found for "{query}"</div>
              )}
              
              {!query.trim() && (
                <div className="p-8 text-center text-slate-400 text-sm">Start typing to search...</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
