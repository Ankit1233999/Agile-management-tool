import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { io } from 'socket.io-client';
import { api } from '../api';

const socketUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:5000';

const orderCards = (cards, listId) => cards
  .filter((card) => card.list === listId || card.list?._id === listId)
  .sort((first, second) => first.position - second.position);

function CardEditor({ card, currentUser, token, socketRef, boardId, boardMembers, onClose, onSave, saving, onUpdateCard }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [assignedTo, setAssignedTo] = useState(
    Array.isArray(card.assignedTo)
      ? card.assignedTo.map((m) => (typeof m === 'object' ? m._id : m))
      : []
  );
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [commentError, setCommentError] = useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setAssignedTo(
      Array.isArray(card.assignedTo)
        ? card.assignedTo.map((m) => (typeof m === 'object' ? m._id : m))
        : []
    );
  }, [card]);

  const emitTypingStart = () => {
    if (socketRef?.current && boardId) {
      socketRef.current.emit('typing:start', {
        boardId,
        userName: currentUser?.name || 'A team member',
        cardId: card._id,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStop();
      }, 2500);
    }
  };

  const emitTypingStop = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socketRef?.current && boardId) {
      socketRef.current.emit('typing:stop', {
        boardId,
        cardId: card._id,
      });
    }
  };

  const submit = (event) => {
    event.preventDefault();
    emitTypingStop();
    onSave({ title, description, assignedTo });
  };

  const toggleAssignee = (memberId) => {
    setAssignedTo((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setAddingComment(true);
    setCommentError('');
    emitTypingStop();

    try {
      const updatedCard = await api.addComment(card._id, { text: commentText.trim() }, token);
      setCommentText('');
      onUpdateCard(updatedCard);
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    setCommentError('');
    try {
      const updatedCard = await api.deleteComment(card._id, commentId, token);
      onUpdateCard(updatedCard);
    } catch (err) {
      setCommentError(err.message || 'Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 overflow-y-auto backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-xl font-bold text-slate-900">Card Details</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              emitTypingStop();
              onClose();
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 text-2xl leading-none"
            aria-label="Close editor"
          >
            &times;
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="card-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Title
            </label>
            <input
              id="card-title"
              value={title}
              onFocus={emitTypingStart}
              onChange={(event) => {
                setTitle(event.target.value);
                emitTypingStart();
              }}
              required
              maxLength="200"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label htmlFor="card-description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              id="card-description"
              value={description}
              onFocus={emitTypingStart}
              onChange={(event) => {
                setDescription(event.target.value);
                emitTypingStart();
              }}
              onBlur={emitTypingStop}
              rows="4"
              maxLength="5000"
              placeholder="Add details, acceptance criteria, or context…"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Assignees Selector */}
          {boardMembers && boardMembers.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned Members
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {boardMembers.map((member) => {
                  const mId = typeof member === 'object' ? member._id : member;
                  const name = typeof member === 'object' ? member.name : 'User';
                  const isSelected = assignedTo.includes(mId);

                  return (
                    <button
                      key={mId}
                      type="button"
                      onClick={() => toggleAssignee(mId)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                        {name.charAt(0).toUpperCase()}
                      </span>
                      {name}
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                emitTypingStop();
                onClose();
              }}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>

        {/* Comment Thread Section */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <span>💬</span> Comments ({card.comments?.length || 0})
          </h3>

          {commentError && (
            <p className="mb-4 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-600">
              {commentError}
            </p>
          )}

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="mb-6 flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={commentText}
                onFocus={emitTypingStart}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  emitTypingStart();
                }}
                onBlur={emitTypingStop}
                rows="2"
                placeholder="Write a comment..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingComment || !commentText.trim()}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {addingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(!card.comments || card.comments.length === 0) ? (
              <p className="py-3 text-center text-xs text-slate-400 italic">No comments yet. Start the discussion!</p>
            ) : (
              card.comments.map((comment) => {
                const authorName = comment.user?.name || 'User';
                const isAuthor = comment.user?._id === currentUser?._id || comment.user === currentUser?._id;
                const formattedDate = comment.createdAt
                  ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div key={comment._id} className="group flex gap-3 rounded-xl bg-slate-50 p-3 text-sm transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-xs">{authorName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{formattedDate}</span>
                          {isAuthor && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment._id)}
                              disabled={deletingCommentId === comment._id}
                              className="text-xs text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                              title="Delete comment"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-slate-700 text-xs whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanBoard({ board, token, currentUser, onBack }) {
  const [boardInfo, setBoardInfo] = useState(board);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeAddCardListId, setActiveAddCardListId] = useState(null);
  const [inlineCardTitle, setInlineCardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [showListInput, setShowListInput] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCard, setSavingCard] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const socketRef = useRef(null);

  const orderedLists = useMemo(() => [...lists].sort((first, second) => first.position - second.position), [lists]);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getBoard(board._id, token);
      setBoardInfo(data.board);
      setLists(data.lists);
      setCards(data.cards);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [board._id, token]);

  useEffect(() => {
    const timer = setTimeout(() => { void loadBoard(); }, 0);
    return () => clearTimeout(timer);
  }, [loadBoard]);

  // Real-Time Socket.io Event Handling
  useEffect(() => {
    if (!token || !board._id) return;

    const socket = io(socketUrl, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-board', board._id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Deduplicated Card Creation Listener
    socket.on('card:created', (newCard) => {
      setCards((current) => {
        if (current.some((c) => c._id === newCard._id)) return current;

        // Check if there is an optimistic temporary card to replace
        const tempIndex = current.findIndex(
          (c) => String(c._id).startsWith('temporary-') &&
                 (c.list === newCard.list || c.list?._id === newCard.list) &&
                 c.title === newCard.title
        );

        if (tempIndex !== -1) {
          const next = [...current];
          next[tempIndex] = newCard;
          return next;
        }

        return [...current, newCard];
      });
    });

    socket.on('card:updated', (updatedCard) => {
      setCards((current) => current.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
      setEditingCard((current) => (current?._id === updatedCard._id ? updatedCard : current));
    });

    socket.on('card:moved', ({ cardId, newListId, newPosition, card }) => {
      setCards((current) => {
        const exists = current.find((c) => c._id === cardId);
        if (!exists && card) return [...current, card];
        return current.map((c) => (c._id === cardId ? { ...c, list: newListId, position: newPosition } : c));
      });
    });

    socket.on('card:deleted', ({ cardId }) => {
      setCards((current) => current.filter((c) => c._id !== cardId));
      setEditingCard((current) => (current?._id === cardId ? null : current));
    });

    socket.on('list:created', (newList) => {
      setLists((current) => {
        if (current.some((l) => l._id === newList._id)) return current;
        return [...current, newList];
      });
    });

    socket.on('list:updated', (updatedList) => {
      setLists((current) => current.map((l) => (l._id === updatedList._id ? updatedList : l)));
    });

    socket.on('list:deleted', ({ listId }) => {
      setLists((current) => current.filter((l) => l._id !== listId));
      setCards((current) => current.filter((c) => c.list !== listId));
    });

    socket.on('typing:start', ({ userName, cardId }) => {
      setTypingUsers((current) => ({ ...current, [cardId || 'general']: userName }));
    });

    socket.on('typing:stop', ({ cardId }) => {
      setTypingUsers((current) => {
        const next = { ...current };
        delete next[cardId || 'general'];
        return next;
      });
    });

    return () => {
      socket.emit('leave-board', board._id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [board._id, token]);

  const showError = (requestError) => setError(requestError.message || 'Unable to save this change.');

  // Create Card Handler with Deduplication Logic
  const createCardInList = async (listId) => {
    if (!inlineCardTitle.trim() || !listId) return;

    const titleText = inlineCardTitle.trim();
    const temporaryId = `temporary-${Date.now()}`;
    const temporaryCard = {
      _id: temporaryId,
      title: titleText,
      description: '',
      list: listId,
      board: board._id,
      position: orderCards(cards, listId).length,
      isSaving: true,
      comments: [],
      assignedTo: [],
    };

    setCards((current) => [...current, temporaryCard]);
    setInlineCardTitle('');
    setActiveAddCardListId(null);
    setError('');

    try {
      const created = await api.createCard({ title: titleText, listId, boardId: board._id }, token);
      setCards((current) => {
        // If socket already added the real card, just filter out temporaryCard
        if (current.some((c) => c._id === created._id)) {
          return current.filter((c) => c._id !== temporaryId);
        }
        return current.map((card) => (card._id === temporaryId ? created : card));
      });
    } catch (requestError) {
      setCards((current) => current.filter((card) => card._id !== temporaryId));
      showError(requestError);
    }
  };

  const saveCard = async (changes) => {
    if (!editingCard) return;
    setSavingCard(true);
    try {
      const updated = await api.updateCard(editingCard._id, changes, token);
      setCards((current) => current.map((card) => (card._id === updated._id ? updated : card)));
      setEditingCard(null);
    } catch (requestError) {
      showError(requestError);
    } finally {
      setSavingCard(false);
    }
  };

  const removeCard = async (card) => {
    const previous = cards;
    setCards((current) => current.filter((item) => item._id !== card._id));
    setError('');
    try {
      await api.deleteCard(card._id, token);
    } catch (requestError) {
      setCards(previous);
      showError(requestError);
    }
  };

  const createList = async (event) => {
    event.preventDefault();
    if (!newListTitle.trim()) return;
    setError('');
    try {
      const created = await api.createList({ title: newListTitle, boardId: board._id }, token);
      setLists((current) => [...current, created]);
      setNewListTitle('');
      setShowListInput(false);
    } catch (requestError) {
      showError(requestError);
    }
  };

  const renameList = async (list) => {
    const title = window.prompt('List title', list.title);
    if (!title?.trim() || title.trim() === list.title) return;
    try {
      const updated = await api.updateList(list._id, { title }, token);
      setLists((current) => current.map((item) => item._id === list._id ? updated : item));
    } catch (requestError) {
      showError(requestError);
    }
  };

  const removeList = async (list) => {
    if (!window.confirm(`Delete “${list.title}” and all its cards?`)) return;
    const previousLists = lists;
    const previousCards = cards;
    setLists((current) => current.filter((item) => item._id !== list._id));
    setCards((current) => current.filter((card) => card.list !== list._id));
    setError('');
    try {
      await api.deleteList(list._id, token);
    } catch (requestError) {
      setLists(previousLists);
      setCards(previousCards);
      showError(requestError);
    }
  };

  const cardsAfterMove = (sourceListId, destinationListId, sourceIndex, destinationIndex) => {
    const sourceCards = orderCards(cards, sourceListId);
    const movingCard = sourceCards[sourceIndex];
    if (!movingCard) return cards;

    let sourceNext;
    let destinationNext;
    if (sourceListId === destinationListId) {
      sourceNext = [...sourceCards];
      sourceNext.splice(sourceIndex, 1);
      sourceNext.splice(destinationIndex, 0, movingCard);
      const positions = new Map(sourceNext.map((card, index) => [card._id, { ...card, position: index }]));
      return cards.map((card) => positions.get(card._id) || card);
    }

    sourceNext = [...sourceCards];
    sourceNext.splice(sourceIndex, 1);
    destinationNext = orderCards(cards, destinationListId);
    destinationNext.splice(destinationIndex, 0, { ...movingCard, list: destinationListId });
    const positions = new Map([
      ...sourceNext.map((card, index) => [card._id, { ...card, position: index }]),
      ...destinationNext.map((card, index) => [card._id, { ...card, list: destinationListId, position: index }]),
    ]);
    return cards.map((card) => positions.get(card._id) || card);
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const previous = cards;
    const movingCard = orderCards(cards, source.droppableId)[source.index];
    if (!movingCard) return;

    setCards(cardsAfterMove(source.droppableId, destination.droppableId, source.index, destination.index));
    setError('');
    try {
      await api.moveCard(movingCard._id, { newListId: destination.droppableId, newPosition: destination.index }, token);
    } catch (requestError) {
      setCards(previous);
      showError(requestError);
    }
  };

  if (loading) {
    return (
      <main className="flex h-96 items-center justify-center p-8">
        <div className="text-center text-slate-500 font-medium">Loading Agile Board…</div>
      </main>
    );
  }

  const activeTypingNames = Object.values(typingUsers);

  return (
    <main className="min-h-[calc(100vh-4rem)] p-6 md:p-8 bg-slate-100/60">
      {/* BOARD HEADER TOOLBAR */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            &larr; Back to workspace
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{boardInfo.title}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isConnected ? 'Real-Time Sync Active' : 'Connecting...'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Drag cards across columns. Updates broadcast instantly via Socket.io to all board members.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Member Avatars Stack */}
          {boardInfo.members && boardInfo.members.length > 0 && (
            <div className="flex items-center -space-x-2 mr-2">
              {boardInfo.members.map((member) => {
                const mName = typeof member === 'object' ? member.name : 'User';
                const mId = typeof member === 'object' ? member._id : member;
                return (
                  <div
                    key={mId}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white ring-2 ring-white shadow-xs"
                    title={mName}
                  >
                    {mName.charAt(0).toUpperCase()}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowListInput((current) => !current)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-xs hover:bg-blue-100 transition"
          >
            <span>+</span> Add list
          </button>
        </div>
      </div>

      {/* TYPING INDICATOR BANNER */}
      {activeTypingNames.length > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs font-medium text-blue-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>⚡ <strong>{activeTypingNames.join(', ')}</strong> {activeTypingNames.length > 1 ? 'are' : 'is'} active on a card...</span>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {/* CREATE NEW LIST FORM */}
      {showListInput && (
        <form onSubmit={createList} className="mb-6 flex max-w-md gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
          <input
            autoFocus
            value={newListTitle}
            onChange={(event) => setNewListTitle(event.target.value)}
            required
            maxLength="100"
            placeholder="List title (e.g. In Review)"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-xs transition">
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowListInput(false)}
            className="px-2 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </form>
      )}

      {/* KANBAN COLUMNS CANVAS */}
      {orderedLists.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          This board has no lists yet. Click <strong>"+ Add list"</strong> to create your first column.
        </section>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex items-start gap-6 overflow-x-auto pb-6 pt-1">
            {orderedLists.map((list) => {
              const listCards = orderCards(cards, list._id);
              const isAddingCard = activeAddCardListId === list._id;

              return (
                <section key={list._id} className="w-80 shrink-0 rounded-2xl border border-slate-200/90 bg-slate-50 p-4 shadow-sm flex flex-col max-h-[calc(100vh-12rem)]">
                  {/* Column Header */}
                  <header className="mb-3 flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => renameList(list)}
                        className="truncate text-left font-extrabold text-slate-800 text-sm hover:text-blue-600 transition"
                        title="Click to rename list"
                      >
                        {list.title}
                      </button>
                      <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-bold text-slate-600">
                        {listCards.length}
                      </span>
                    </div>

                    <button
                      onClick={() => removeList(list)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600 transition leading-none text-base"
                      aria-label={`Delete ${list.title}`}
                      title="Delete list"
                    >
                      &times;
                    </button>
                  </header>

                  {/* Column Cards Droppable Area */}
                  <Droppable droppableId={list._id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto min-h-24 rounded-xl p-1 transition ${
                          snapshot.isDraggingOver ? 'bg-blue-100/60 ring-2 ring-blue-400/30' : ''
                        }`}
                      >
                        {listCards.map((card, index) => (
                          <Draggable key={card._id} draggableId={card._id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <article
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`mb-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition hover:border-blue-300 hover:shadow-md ${
                                  dragSnapshot.isDragging ? 'rotate-1 shadow-xl ring-2 ring-blue-500 bg-white' : ''
                                } ${card.isSaving ? 'opacity-60' : ''}`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <button
                                    onClick={() => setEditingCard(card)}
                                    className="min-w-0 flex-1 text-left group"
                                  >
                                    <p className="break-words text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
                                      {card.title}
                                    </p>
                                    {card.description && (
                                      <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">
                                        {card.description}
                                      </p>
                                    )}

                                    {/* Card Metadata Footer */}
                                    <div className="mt-3 flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                                      {/* Assignees Avatars */}
                                      {card.assignedTo && card.assignedTo.length > 0 ? (
                                        <div className="flex -space-x-1.5 overflow-hidden">
                                          {card.assignedTo.map((member) => {
                                            const name = typeof member === 'object' ? member.name : 'Member';
                                            const initial = (name || 'M').charAt(0).toUpperCase();
                                            const mId = typeof member === 'object' ? member._id : member;
                                            return (
                                              <div
                                                key={mId}
                                                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white shadow-xs"
                                                title={name}
                                              >
                                                {initial}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : <div />}

                                      {/* Comments Badge */}
                                      {card.comments && card.comments.length > 0 && (
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                          <span>💬</span> {card.comments.length}
                                        </div>
                                      )}
                                    </div>
                                  </button>

                                  <button
                                    onClick={() => removeCard(card)}
                                    className="text-xs text-slate-300 hover:text-red-600 transition p-1"
                                    aria-label={`Delete ${card.title}`}
                                    title="Delete card"
                                  >
                                    &times;
                                  </button>
                                </div>
                              </article>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Inline Add Card Form / Button */}
                  <footer className="mt-2 pt-2 border-t border-slate-200/60">
                    {isAddingCard ? (
                      <div className="rounded-xl border border-blue-200 bg-white p-2.5 shadow-sm space-y-2">
                        <textarea
                          autoFocus
                          value={inlineCardTitle}
                          onChange={(e) => setInlineCardTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              createCardInList(list._id);
                            }
                          }}
                          rows="2"
                          placeholder="Card title…"
                          className="w-full text-xs font-medium text-slate-800 outline-none resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => createCardInList(list._id)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                          >
                            Add card
                          </button>
                          <button
                            onClick={() => {
                              setActiveAddCardListId(null);
                              setInlineCardTitle('');
                            }}
                            className="text-xs font-medium text-slate-400 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveAddCardListId(list._id);
                          setInlineCardTitle('');
                        }}
                        className="w-full flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition"
                      >
                        <span className="text-sm">+</span> Add a card
                      </button>
                    )}
                  </footer>
                </section>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* CARD EDITOR MODAL */}
      {editingCard && (
        <CardEditor
          card={editingCard}
          currentUser={currentUser}
          token={token}
          socketRef={socketRef}
          boardId={board._id}
          boardMembers={boardInfo?.members || []}
          onClose={() => setEditingCard(null)}
          onSave={saveCard}
          saving={savingCard}
          onUpdateCard={(updatedCard) => {
            setCards((current) => current.map((c) => (c._id === updatedCard._id ? updatedCard : c)));
            setEditingCard(updatedCard);
          }}
        />
      )}
    </main>
  );
}

export default KanbanBoard;
