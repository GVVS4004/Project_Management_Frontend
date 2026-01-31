import { z } from "zod";
import { ProjectStatus } from "../types/project.types";

/**
 * Zod schema for creating a new project
 * Validates form data before sending to backend
 */
export const createProjectSchema = z
  .object({
    // Name: Required, max 100 chars (matches backend @NotBlank @Size(max=100))
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name must be less than 100 characters")
      .trim(),

    // Description: Optional, max 2000 chars (matches backend @Column(length=2000))
    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .trim()
      .or(z.literal("")),  // Allow empty string

    // Start date: Optional, must be valid date string
    startDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: "Invalid start date" }
      ),

    // End date: Optional, must be valid date string
    endDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const parsed = new Date(date);
          return !isNaN(parsed.getTime());
        },
        { message: "Invalid end date format" }
      ),
  })
  // Custom validation: endDate must be after startDate
  .refine(
    (data) => {
      // If either date is missing, skip validation
      if (!data.startDate || !data.endDate) return true;

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      // End date must be >= start date
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"], // Show error on endDate field
    }
  );

/**
 * Update project schema - all fields optional
 * Users can update only specific fields when editing
 */
export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name cannot be empty")
      .max(100, "Project name must be less than 100 characters")
      .trim()
      .optional(),

    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .trim()
      .optional(),

    status: z
      .nativeEnum(ProjectStatus, {
        message: "Invalid project status",
      })
      .optional(),

    startDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const parsed = new Date(date);
          return !isNaN(parsed.getTime());
        },
        { message: "Invalid start date" }
      ),

    endDate: z
      .string()
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const parsed = new Date(date);
          return !isNaN(parsed.getTime());
        },
        { message: "Invalid end date" }
      ),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

/**
 * TypeScript types inferred from Zod schemas
 * No need to manually write types - Zod generates them!
 *
 * Usage:
 *   const formData: CreateProjectFormData = { name: "...", description: "..." }
 */
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
