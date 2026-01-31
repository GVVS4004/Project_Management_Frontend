  /**
   * Project-related TypeScript type definitions
   * Matches backend API contracts for type safety
   */

  // 1. ProjectStatus Enum
  export enum ProjectStatus {
    PLANNING = 'PLANNING',
    ACTIVE = 'ACTIVE',
    ON_HOLD = 'ON_HOLD',
    COMPLETED = 'COMPLETED',
    ABANDONED = 'ABANDONED'
  }

  // 2. UserSummary Interface
  export interface UserSummary {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  }

  // 3. Project Interface (main entity)
  export interface Project {
    id: number;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
    startDate: string | null;
    endDate: string | null;
    owner: UserSummary;
  }

  // 4. Request Types (data sent TO server)
  export interface CreateProjectRequest {
    name: string;
    description: string;
    startDate?: string | null;
    endDate?: string | null;
  }

  export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string | null;
    endDate?: string | null;
  }

  // 5. UI Helper Types
  export interface ProjectFilters {
    search: string;
    status: ProjectStatus | 'ALL';
  }

  export type ProjectViewMode = 'grid' | 'list';

  // 6. API Response Wrapper
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
  }

  // 7. Paginated Response (for when we add pagination later)
  export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  }

  export enum ProjectRole{
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
  }

  export interface ProjectMember{
    projectId: number;
    user: UserSummary;
    role: ProjectRole;
    joinedAt: string;
  }

  export interface AddMemberRequest{
    userId: number;
    role: ProjectRole;
  }

  export interface UpdateMemberRoleRequest{
    role: ProjectRole;
  }

  
