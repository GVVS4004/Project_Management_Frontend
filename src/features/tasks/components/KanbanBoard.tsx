import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Task } from "../types/task.types";
import { TaskStatus } from "../types/task.types";
import { useUpdateTaskStatus } from "../hooks/useTasks";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";

// Columns to display on the board (order matters)
const BOARD_COLUMNS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.REVIEW,
  TaskStatus.TESTING,
  TaskStatus.DONE,
  TaskStatus.ABANDONED,
];

interface KanbanBoardProps {
  tasks: Task[];
  projectId: number;
  onTaskClick?: (task: Task) => void;
}

const KanbanBoard = ({ tasks, projectId, onTaskClick }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskStatusMutation = useUpdateTaskStatus();

  const columns = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    for (const status of BOARD_COLUMNS) {
      grouped[status] = [];
    }
    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }
    return grouped;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // Resolve the target column status from a droppable/sortable id
  const resolveStatus = (id: string | number): TaskStatus | null => {
    // Check if the id is a column status directly
    if (Object.values(TaskStatus).includes(id as TaskStatus)) {
      return id as TaskStatus;
    }
    // Otherwise it's a task id — find which column it belongs to
    const overTask = tasks.find((t) => t.id === id);
    return overTask?.status ?? null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = resolveStatus(over.id);

    if (newStatus && newStatus !== task.status) {
      updateTaskStatusMutation.mutate({ taskId, status: newStatus, projectId });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)] scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {BOARD_COLUMNS.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
