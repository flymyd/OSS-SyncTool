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

export const createWorkspace = (data: CreateWorkspaceParams): Promise<Workspace> => {
  return request.post('/workspace', data);
};

export const getWorkspaces = (): Promise<Workspace[]> => {
  return request.get('/workspace');
};

export const deleteWorkspace = (id: number): Promise<void> => {
  return request.delete(`/workspace/${id}`);
}; 