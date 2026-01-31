import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject, useUpdateProject, useUpdateProjectStatus } from "../hooks/useProjects";
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectFormData,
  type UpdateProjectFormData,
} from "../schemas/project.schema";
import type { Project } from "../types/project.types";
import { ProjectStatus } from "../types/project.types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Modal from "../../../components/Modal";
import { Button, ErrorMessage, Input } from "../../../components/forms";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  project?: Project;  // Optional: only needed in edit mode
}
export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  project,
}) => {
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const updateStatusMutation = useUpdateProjectStatus();

  const schema = mode === "create" ? createProjectSchema : updateProjectSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectFormData | UpdateProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit" && project
        ? {
            name: project.name,
            description: project.description || "",
            status: project.status,
            startDate: project.startDate || "",
            endDate: project.endDate || "",
          }
        : {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
          },
  });


  useEffect(() => {
    if (mode === "edit" && project) {
      reset({
        name: project.name,
        description: project.description || "",
        status: project.status,
        startDate: project.startDate || "",
        endDate: project.endDate || "",
      });
    }
  }, [project, mode, reset]);

  const onSubmit = async (
    data: CreateProjectFormData | UpdateProjectFormData
  ) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data as CreateProjectFormData);
      } else if (mode === "edit" && project) {
        await updateMutation.mutateAsync({
          projectId: project.id,
          data: data as UpdateProjectFormData,
        });
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Create New Project" : "Edit Project"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            {...register("name")}
            error={errors.name?.message}
            required
            // value={project?.name}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Enter project description (optional)"
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage message={errors.description.message as string} />
          )}
        </div>

        {/* Status Field - Only shown in Edit mode */}
        {mode === "edit" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                errors.status as any
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              {...register("status")}
            >
              <option value={ProjectStatus.PLANNING}>Planning</option>
              <option value={ProjectStatus.ACTIVE}>Active</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
              <option value={ProjectStatus.ABANDONED}>Abandoned</option>
            </select>
            {(errors as any).status && (
              <ErrorMessage message={(errors as any).status.message as string} />
            )}
          </div>
        )}

         {/* Date Fields: Start Date and End Date */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Start Date */}
           <div>
             <Input
               label="Start Date"
               type="date"
               error={errors.startDate?.message}
               {...register('startDate')}
             />
           </div>

           {/* End Date */}
           <div>
             <Input
               label="End Date"
               type="date"
               error={errors.endDate?.message}
               {...register('endDate')}
             />
           </div>
         </div>

         {/* API Error Message */}
         {(createMutation.isError || updateMutation.isError) && (
           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
             <p className="text-sm text-red-600">
               {createMutation.error?.message || updateMutation.error?.message || 'An error occurred'}
             </p>
           </div>
         )}

         {/* Form Actions: Cancel and Submit buttons */}
         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
           {/* Cancel Button */}
           <Button
             type="button"
             variant="outline"
             onClick={handleClose}
             disabled={isSubmitting}
           >
             Cancel
           </Button>

           {/* Submit Button */}
           <Button
             type="submit"
             variant="primary"
             loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
             disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
           >
             {mode === 'create' ? 'Create Project' : 'Save Changes'}
           </Button>
         </div>
      </form>
    </Modal>
  );
};
