import request from '../utils/request';

export interface CreateWorkspaceParams {
  name: string;
}

export interface Workspace {
  id: number;
  name: string;
  creator: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceFilters {
  name?: string;
  creatorName?: string;
}

export const createWorkspace = (data: CreateWorkspaceParams): Promise<Workspace> => {
  return request.post('/workspace', data);
};

export const getWorkspaces = (filters?: WorkspaceFilters): Promise<Workspace[]> => {
  return request.get('/workspace', { params: filters });
};

export const deleteWorkspace = (id: number): Promise<void> => {
  return request.delete(`/workspace/${id}`);
}; 