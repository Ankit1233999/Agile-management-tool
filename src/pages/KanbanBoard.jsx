import { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { api } from '../api';

const orderCards = (cards, listId) => cards
  .filter((card) => card.list === listId || card.list?._id === listId)
  .sort((first, second) => first.position - second.position);

function CardEditor({ card, onClose, onSave, saving }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  const submit = (event) => {
    event.preventDefault();
    onSave({ title, description });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Edit card</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close editor">&times;</button>
        </div>
        <label htmlFor="card-title" className="mb-2 block text-sm font-medium text-slate-700">Title</label>
        <input id="card-title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength="200" className="mb-4 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor="card-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
        <textarea id="card-description" value={description} onChange={(event) => setDescription(event.target.value)} rows="6" maxLength="5000" placeholder="Add details, acceptance criteria, or context…" className="w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save card'}</button>
        </div>
      </form>
    </div>
  );
}

function KanbanBoard({ board, token, onBack }) {
  const [boardInfo, setBoardInfo] = useState(board);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardListId, setNewCardListId] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [showListInput, setShowListInput] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCard, setSavingCard] = useState(false);
  const [error, setError] = useState('');

  const orderedLists = useMemo(() => [...lists].sort((first, second) => first.position - second.position), [lists]);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getBoard(board._id, token);
      setBoardInfo(data.board);
      setLists(data.lists);
      setCards(data.cards);
      setNewCardListId((current) => current || data.lists[0]?._id || '');
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

  const showError = (requestError) => setError(requestError.message || 'Unable to save this change.');

  const createCard = async (event) => {
    event.preventDefault();
    const targetListId = lists.some((list) => list._id === newCardListId)
      ? newCardListId
      : lists[0]?._id;
    if (!newCardTitle.trim() || !targetListId) return;

    const temporaryId = `temporary-${Date.now()}`;
    const temporaryCard = {
      _id: temporaryId,
      title: newCardTitle.trim(),
      description: '',
      list: targetListId,
      board: board._id,
      position: orderCards(cards, targetListId).length,
      isSaving: true,
    };
    setCards((current) => [...current, temporaryCard]);
    setNewCardTitle('');
    setError('');

    try {
      const created = await api.createCard({ title: temporaryCard.title, listId: targetListId, boardId: board._id }, token);
      setCards((current) => current.map((card) => card._id === temporaryId ? created : card));
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
      setCards((current) => current.map((card) => card._id === updated._id ? updated : card));
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
      setNewCardListId(created._id);
    } catch (requestError) {
      showError(requestError);
    }
  };

  const renameList = async (list) => {
    const title = window.prompt('List name', list.title);
    if (!title?.trim() || title.trim() === list.title) return;
    try {
      const updated = await api.updateList(list._id, { title }, token);
      setLists((current) => current.map((item) => item._id === list._id ? updated : item));
    } catch (requestError) {
      showError(requestError);
    }
  };

  const removeList = async (list) => {
    if (!window.confirm(`Delete “${list.title}” and its cards?`)) return;
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

  if (loading) return <main className="p-8 text-slate-500">Loading board…</main>;

  return (
    <main className="min-h-[calc(100vh-4rem)] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button onClick={onBack} className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800">&larr; Back to workspace</button>
          <h1 className="text-3xl font-bold text-slate-900">{boardInfo.title}</h1>
          <p className="mt-1 text-slate-600">Drag cards between lists. Changes are saved automatically.</p>
        </div>
        <button onClick={() => setShowListInput((current) => !current)} className="self-start rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 font-medium text-blue-700 hover:bg-blue-100">+ Add list</button>
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {showListInput && (
        <form onSubmit={createList} className="mb-6 flex max-w-lg gap-3 rounded-xl border bg-white p-4 shadow-sm">
          <input autoFocus value={newListTitle} onChange={(event) => setNewListTitle(event.target.value)} required maxLength="100" placeholder="e.g. Review" className="min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Add</button>
          <button type="button" onClick={() => setShowListInput(false)} className="px-2 text-slate-500 hover:text-slate-800">Cancel</button>
        </form>
      )}

      {orderedLists.length > 0 && (
        <form onSubmit={createCard} className="mb-7 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <select value={lists.some((list) => list._id === newCardListId) ? newCardListId : (lists[0]?._id || '')} onChange={(event) => setNewCardListId(event.target.value)} className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            {orderedLists.map((list) => <option key={list._id} value={list._id}>{list.title}</option>)}
          </select>
          <input value={newCardTitle} onChange={(event) => setNewCardTitle(event.target.value)} required maxLength="200" placeholder="What needs to be done?" className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">Add card</button>
        </form>
      )}

      {orderedLists.length === 0 ? (
        <section className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-500">This board has no lists. Add a list to begin.</section>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex items-start gap-5 overflow-x-auto pb-6">
            {orderedLists.map((list) => {
              const listCards = orderCards(cards, list._id);
              return (
                <section key={list._id} className="w-80 shrink-0 rounded-xl border bg-slate-50 p-3 shadow-sm">
                  <header className="mb-3 flex items-center justify-between gap-2 px-1">
                    <button onClick={() => renameList(list)} className="truncate text-left font-semibold text-slate-800 hover:text-blue-700" title="Rename list">{list.title}</button>
                    <div className="flex items-center gap-2"><span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">{listCards.length}</span><button onClick={() => removeList(list)} className="text-sm text-slate-400 hover:text-red-600" aria-label={`Delete ${list.title}`}>&times;</button></div>
                  </header>
                  <Droppable droppableId={list._id}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`min-h-28 rounded-lg p-1.5 transition ${snapshot.isDraggingOver ? 'bg-blue-100' : ''}`}>
                        {listCards.map((card, index) => (
                          <Draggable key={card._id} draggableId={card._id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <article ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} className={`mb-2 rounded-lg border bg-white p-3 shadow-sm transition ${dragSnapshot.isDragging ? 'rotate-1 shadow-md ring-2 ring-blue-400' : 'hover:border-blue-300'} ${card.isSaving ? 'opacity-60' : ''}`}>
                                <div className="flex items-start gap-2">
                                  <button onClick={() => setEditingCard(card)} className="min-w-0 flex-1 text-left"><p className="break-words text-sm font-medium text-slate-800">{card.title}</p>{card.description && <p className="mt-2 line-clamp-2 text-xs text-slate-500">{card.description}</p>}</button>
                                  <button onClick={() => removeCard(card)} className="text-sm text-slate-300 hover:text-red-600" aria-label={`Delete ${card.title}`}>&times;</button>
                                </div>
                              </article>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </section>
              );
            })}
          </div>
        </DragDropContext>
      )}
      {editingCard && <CardEditor card={editingCard} onClose={() => setEditingCard(null)} onSave={saveCard} saving={savingCard} />}
    </main>
  );
}

export default KanbanBoard;
