import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: {
      title: "To Do",
      tasks: [
        { id: "task-1", title: "Create project structure" },
        { id: "task-2", title: "Build dashboard UI" },
      ],
    },
    progress: {
      title: "In Progress",
      tasks: [
        { id: "task-3", title: "Setup GitHub repository" },
      ],
    },
    done: {
      title: "Done",
      tasks: [],
    },
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    const sourceTasks = [...sourceColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
      });

      return;
    }

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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Kanban Board
      </h1>

      <p className="text-gray-600 mb-6">
        Manage your project tasks
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-white rounded-xl p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">
                {column.title}
              </h2>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 border rounded-lg p-4 mb-3 cursor-grab hover:shadow-md"
                          >
                            <p className="font-medium text-gray-800">
                              {task.title}
                            </p>
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
    </div>
  );
}

export default KanbanBoard;