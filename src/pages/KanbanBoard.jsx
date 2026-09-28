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
        {
          id: "task-1",
          title: "Create project structure",
        },
        {
          id: "task-2",
          title: "Build dashboard UI",
        },
      ],
    },

    progress: {
      id: "progress",
      title: "In Progress",
      tasks: [
        {
          id: "task-3",
          title: "Setup GitHub repository",
        },
      ],
    },

    done: {
      id: "done",
      title: "Done",
      tasks: [],
    },
  });

  const [newTask, setNewTask] = useState("");

  // ===============================
  // SOCKET CONNECTION
  // ===============================

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to Socket.io:", socket.id);

      socket.emit("join-board", boardId);
    });

    // Receive task movement from another user
    socket.on("task-moved", (data) => {
      console.log("Task moved by another user:", data);

      setColumns((currentColumns) => {
        const updatedColumns = {
          ...currentColumns,
        };

        // Remove task from every column
        Object.keys(updatedColumns).forEach((columnId) => {
          updatedColumns[columnId] = {
            ...updatedColumns[columnId],
            tasks: updatedColumns[columnId].tasks.filter(
              (task) => task.id !== data.taskId
            ),
          };
        });

        // Add task to new column
        const movedTask = {
          id: data.taskId,
          title: data.taskTitle,
        };

        updatedColumns[data.destinationColumn].tasks.splice(
          data.destinationIndex,
          0,
          movedTask
        );

        return updatedColumns;
      });
    });

    // Receive new task from another user
    socket.on("task-created", (data) => {
      console.log("New task from another user:", data);

      setColumns((currentColumns) => ({
        ...currentColumns,
        todo: {
          ...currentColumns.todo,
          tasks: [
            ...currentColumns.todo.tasks,
            {
              id: data.taskId,
              title: data.taskTitle,
            },
          ],
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
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  // ===============================
  // ADD TASK
  // ===============================

  const addTask = () => {
    if (!newTask.trim()) {
      return;
    }

    const taskId = `task-${Date.now()}`;

    const task = {
      id: taskId,
      title: newTask,
    };

    setColumns((currentColumns) => ({
      ...currentColumns,

      todo: {
        ...currentColumns.todo,

        tasks: [
          ...currentColumns.todo.tasks,
          task,
        ],
      },
    }));

    // Send task to other users
    socket.emit("task-created", {
      boardId,
      taskId,
      taskTitle: newTask,
    });

    setNewTask("");
  };

  // ===============================
  // DRAG AND DROP
  // ===============================

  const onDragEnd = (result) => {
    const {
      destination,
      source,
      draggableId,
    } = result;

    // Dropped outside board
    if (!destination) {
      return;
    }

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn =
      columns[source.droppableId];

    const destinationColumn =
      columns[destination.droppableId];

    const movedTask =
      sourceColumn.tasks[source.index];

    // Moving inside same column
    if (
      source.droppableId ===
      destination.droppableId
    ) {
      const newTasks = [
        ...sourceColumn.tasks,
      ];

      newTasks.splice(source.index, 1);

      newTasks.splice(
        destination.index,
        0,
        movedTask
      );

      setColumns({
        ...columns,

        [source.droppableId]: {
          ...sourceColumn,
          tasks: newTasks,
        },
      });
    }

    // Moving to another column
    else {
      const sourceTasks = [
        ...sourceColumn.tasks,
      ];

      sourceTasks.splice(source.index, 1);

      const destinationTasks = [
        ...destinationColumn.tasks,
      ];

      destinationTasks.splice(
        destination.index,
        0,
        movedTask
      );

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

    // Send movement to other users
    socket.emit("task-moved", {
      boardId,
      taskId: draggableId,
      taskTitle: movedTask.title,
      destinationColumn:
        destination.droppableId,
      destinationIndex:
        destination.index,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Kanban Board
      </h1>

      <p className="text-gray-600 mb-6">
        Manage your project tasks
      </p>

      {/* Add Task */}
      <div className="flex gap-3 mb-8">

        <input
          type="text"
          value={newTask}
          onChange={(e) =>
            setNewTask(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="Enter new task..."
          className="flex-1 max-w-xl px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addTask}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Task
        </button>

      </div>

      {/* Kanban Board */}

      <DragDropContext onDragEnd={onDragEnd}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {Object.values(columns).map(
            (column) => (

              <div
                key={column.id}
                className="bg-white rounded-xl shadow-sm p-4"
              >

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {column.title}
                </h2>

                <Droppable
                  droppableId={column.id}
                >
                  {(provided, snapshot) => (

                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[300px] rounded-lg p-2 transition ${
                        snapshot.isDraggingOver
                          ? "bg-blue-50"
                          : "bg-gray-50"
                      }`}
                    >

                      {column.tasks.map(
                        (task, index) => (

                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (

                              <div
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white border rounded-lg p-4 mb-3 shadow-sm cursor-grab"
                              >

                                <p className="font-medium text-gray-800">
                                  {task.title}
                                </p>

                              </div>

                            )}
                          </Draggable>

                        )
                      )}

                      {provided.placeholder}

                    </div>

                  )}
                </Droppable>

              </div>

            )
          )}

        </div>

      </DragDropContext>

    </div>
  );
}

export default KanbanBoard;