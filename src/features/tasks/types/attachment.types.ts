import type { UserSummary } from "../../projects/types/project.types";

  export interface Attachment {
    id: number;
    fileName: string;
    fileSize: number;
    contentType: string;
    taskId: number;
    uploadedBy: UserSummary;
    createdAt: string;
  }