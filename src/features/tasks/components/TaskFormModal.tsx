import { useEffect, useState } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import Modal from "../../../components/Modal";
  import { Button, Input, ErrorMessage } from "../../../components/forms";
  import UserSearchSelect from "../../../components/UserSearchSelect";
  import { TaskPriority, TaskType } from "../types/task.types";
  import type { Task } from "../types/task.types";
  import type { User } from "../../../types/auth.types";
  import { useCreateTask, useUpdateTask } from "../hooks/useTasks";
  import {
    createTaskSchema,
    updateTaskSchema,
    type CreateTaskFormData,
    type UpdateTaskFormData,
  } from "../schemas/task.schema";
import RichTextEditor from "../../../components/editor/RichTextEditor";

  interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: number;
    task?: Task | null; // If provided → edit mode
  }

  const TaskFormModal = ({ isOpen, onClose, projectId, task }: TaskFormModalProps) => {
    const isEditMode = !!task;
    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();

    const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
      setValue,
      watch,
    } = useForm<CreateTaskFormData | UpdateTaskFormData>({
      resolver: zodResolver(isEditMode ? updateTaskSchema : createTaskSchema),
      defaultValues: {
        title: "",
        description: "",
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
        dueDate: undefined,
      },
    });

    // Populate form when editing
    useEffect(() => {
      if (isEditMode && task && isOpen) {
        reset({
          title: task.title,
          description: task.description || "",
          type: task.type,
          priority: task.priority,
          dueDate: task.dueDate || "",
          assignedToId: task.assignedTo?.id ?? undefined,
        });
        // Set assignee for UserSearchSelect
        if (task.assignedTo) {
          setSelectedAssignee({
            id: task.assignedTo.id,
            username: task.assignedTo.userName || "",
            email: task.assignedTo.email || "",
            firstName: task.assignedTo.firstName,
            lastName: task.assignedTo.lastName,
            profileImageUrl: task.assignedTo.profileImageUrl,
          } as User);
        } else {
          setSelectedAssignee(null);
        }
      }
    }, [task, isEditMode, isOpen, reset]);

    const onSubmit = async (data: CreateTaskFormData | UpdateTaskFormData) => {
      try {
        const payload = {
          ...data,
          assignedToId: selectedAssignee?.id ?? undefined,
          dueDate: data.dueDate || undefined,
          description: data.description || "",
        };

        if (isEditMode && task) {
          await updateMutation.mutateAsync({
            taskId: task.id,
            updateData: payload,
          });
        } else {
          await createMutation.mutateAsync({
            ...payload,
            projectId,
          });
        }
        handleClose();
      } catch (error) {
        console.error(`Error ${isEditMode ? "updating" : "creating"} task:`, error);
      }
    };

    const handleClose = () => {
      reset({
        title: "",
        description: "",
        type: TaskType.TASK,
        priority: TaskPriority.MEDIUM,
        dueDate: undefined,
      });
      setSelectedAssignee(null);
      onClose();
    };

    const mutation = isEditMode ? updateMutation : createMutation;

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditMode ? "Edit Task" : "Create New Task"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            type="text"
            placeholder="Enter task title"
            {...register("title")}
            error={errors.title?.message}
          />

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <RichTextEditor
                key={task?.id ?? "new"}
                content={watch("description") || ""}
                onChange={(html) => setValue("description", html)}
                placeholder="Enter task description (optional)"
              />
              {errors.description && (
                <ErrorMessage message={errors.description.message as string} />
              )}
            </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="task-type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                {...register("type")}
              >
                {Object.values(TaskType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="task-priority"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                {...register("priority")}
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />

          {/* Assignee */}
          <UserSearchSelect
            label="Assignee"
            selectedUser={selectedAssignee}
            onSelect={(user) => setSelectedAssignee(user)}
          />

          {/* Error */}
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                {mutation.error?.message || `Failed to ${isEditMode ? "update" : "create"} task`}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || mutation.isPending}
              disabled={isSubmitting || mutation.isPending}
            >
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  export default TaskFormModal;