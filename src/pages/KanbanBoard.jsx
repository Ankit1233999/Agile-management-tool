import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const socket = io("http://localhost:5000");

function KanbanBoard() {
  const boardId = "main-board";

  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "task-1", title: "Create project structure" },
        { id: "task-2", title: "Build dashboard UI" },
      ],
    },
    progress: {
      id: "progress",
      title: "In Progress",
      tasks: [
        { id: "task-3", title: "Setup GitHub repository" },
      ],
    },
    done: {
      id: "done",
      title: "Done",
      tasks: [],
    },
  });

  const [newTask, setNewTask] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");
  const [newListTitle, setNewListTitle] = useState("");
  const [showAddListModal, setShowAddListModal] = useState(false);

  // ===============================
  // SOCKET CONNECTION & INITIAL FETCH
  // ===============================
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to Socket.io:", socket.id);
      socket.emit("join-board", boardId);
    });

    socket.on("task-moved", (data) => {
      console.log("Task moved by another user:", data);
      setColumns((currentColumns) => {
        const updatedColumns = { ...currentColumns };

        Object.keys(updatedColumns).forEach((colId) => {
          if (updatedColumns[colId]) {
            updatedColumns[colId] = {
              ...updatedColumns[colId],
              tasks: updatedColumns[colId].tasks.filter(
                (task) => task.id !== data.taskId
              ),
            };
          }
        });

        const movedTask = {
          id: data.taskId,
          title: data.taskTitle,
        };

        if (updatedColumns[data.destinationColumn]) {
          updatedColumns[data.destinationColumn].tasks.splice(
            data.destinationIndex,
            0,
            movedTask
          );
        }

        return updatedColumns;
      });
    });

    socket.on("task-created", (data) => {
      console.log("New task from another user:", data);
      const targetCol = data.targetColumn || "todo";
      setColumns((currentColumns) => {
        if (!currentColumns[targetCol]) return currentColumns;
        return {
          ...currentColumns,
          [targetCol]: {
            ...currentColumns[targetCol],
            tasks: [
              ...currentColumns[targetCol].tasks,
              { id: data.taskId, title: data.taskTitle },
            ],
          },
        };
      });
    });

    socket.on("list-created", (data) => {
      setColumns((currentColumns) => ({
        ...currentColumns,
        [data.listId]: {
          id: data.listId,
          title: data.listTitle,
          tasks: [],
        },
      }));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io");
    });

    return () => {
      socket.off("connect");
      socket.off("task-moved");
      socket.off("task-created");
      socket.off("list-created");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  // ===============================
  // ADD TASK (CRUD Operation)
  // ===============================
  const addTask = async () => {
    if (!newTask.trim()) return;

    const taskId = `task-${Date.now()}`;
    const task = { id: taskId, title: newTask.trim() };
    const targetCol = selectedColumn || Object.keys(columns)[0] || "todo";

    // Optimistic state update
    setColumns((currentColumns) => ({
      ...currentColumns,
      [targetCol]: {
        ...currentColumns[targetCol],
        tasks: [...(currentColumns[targetCol]?.tasks || []), task],
      },
    }));

    // Broadcast Socket Event
    socket.emit("task-created", {
      boardId,
      taskId,
      taskTitle: newTask.trim(),
      targetColumn: targetCol,
    });

    setNewTask("");
  };

  // ===============================
  // DELETE TASK (CRUD Operation)
  // ===============================
  const deleteTask = (columnId, taskId) => {
    setColumns((currentColumns) => ({
      ...currentColumns,
      [columnId]: {
        ...currentColumns[columnId],
        tasks: currentColumns[columnId].tasks.filter((t) => t.id !== taskId),
      },
    }));
  };

  // ===============================
  // ADD LIST / COLUMN (CRUD Operation)
  // ===============================
  const addList = () => {
    if (!newListTitle.trim()) return;

    const listId = `col-${Date.now()}`;
    const newList = {
      id: listId,
      title: newListTitle.trim(),
      tasks: [],
    };

    setColumns((prev) => ({
      ...prev,
      [listId]: newList,
    }));

    socket.emit("list-created", {
      boardId,
      listId,
      listTitle: newListTitle.trim(),
    });

    setNewListTitle("");
    setShowAddListModal(false);
  };

  // ===============================
  // DELETE LIST (CRUD Operation)
  // ===============================
  const deleteList = (columnId) => {
    setColumns((prev) => {
      const copy = { ...prev };
      delete copy[columnId];
      return copy;
    });
  };

  // ===============================
  // DRAG AND DROP (Optimistic State Optimization)
  // ===============================
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const movedTask = sourceColumn.tasks[source.index];

    if (source.droppableId === destination.droppableId) {
      const newTasks = [...sourceColumn.tasks];
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: newTasks,
        },
      });
    } else {
      const sourceTasks = [...sourceColumn.tasks];
      sourceTasks.splice(source.index, 1);

      const destinationTasks = [...destinationColumn.tasks];
      destinationTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destinationColumn,
          tasks: destinationTasks,
        },
      });
    }

    // Broadcast movement to Socket server
    socket.emit("task-moved", {
      boardId,
      taskId: draggableId,
      taskTitle: movedTask.title,
      destinationColumn: destination.droppableId,
      destinationIndex: destination.index,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
          <p className="text-gray-600 mt-1">Manage project lists and card CRUD operations</p>
        </div>
        <button
          onClick={() => setShowAddListModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          + Add New Column
        </button>
      </div>

      {/* Add Task Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-3 items-center">
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          {Object.values(columns).map((col) => (
            <option key={col.id} value={col.id}>
              List: {col.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Type card description/title..."
          className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addTask}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Add Card
        </button>
      </div>

      {/* Kanban Board Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
          {Object.values(columns).map((column) => (
            <div
              key={column.id}
              className="bg-white rounded-xl shadow-sm border p-4 flex flex-col min-h-[350px]"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-800">{column.title}</h2>
                  <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full font-medium">
                    {column.tasks.length}
                  </span>
                </div>
                {Object.keys(columns).length > 1 && (
                  <button
                    onClick={() => deleteList(column.id)}
                    className="text-gray-400 hover:text-red-500 text-sm font-semibold transition"
                    title="Delete column"
                  >
                    ✕
                  </button>
                )}
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-lg p-2 transition ${
                      snapshot.isDraggingOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : "bg-gray-50"
                    }`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border rounded-lg p-3 mb-3 shadow-sm flex justify-between items-start group transition ${
                              snapshot.isDragging ? "shadow-md ring-2 ring-blue-400" : "hover:border-blue-300"
                            }`}
                          >
                            <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                            <button
                              onClick={() => deleteTask(column.id, task.id)}
                              className="text-gray-300 hover:text-red-500 text-xs font-semibold ml-2 opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Column Modal */}
      {showAddListModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Column</h3>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="e.g., Code Review, QA, Backlog"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
              onKeyDown={(e) => {
                if (e.key === "Enter") addList();
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddListModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={addList}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Create Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;