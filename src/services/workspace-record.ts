import request from '../utils/request';
import { FileInfo } from '../types/workspace';
import { WorkspaceRecordResponse } from '../types/workspace-record';

export interface CreateWorkspaceRecordRequest {
  workspaceId: number;
  filePath: string;
  etag: string;
  size: number;
  file: File;
}

export interface UpdateWorkspaceRecordRequest extends CreateWorkspaceRecordRequest {
  id: number;
}

export interface WorkspaceRecordResponse {
  id: number;
  filePath: string;
  etag: string;
  size: number;
  workspace: {
    id: number;
    name: string;
  };
  modifier: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SyncFileInfo {
  id: number;
  path: string;
  name: string;
  size: number;
  etag: string;
}

export interface SyncTaskRecord {
  fileName: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface SyncTaskResponse {
  status: 'success' | 'partial_success' | 'failed';
  totalFiles: number;
  failedFiles: number;
  records: SyncTaskRecord[];
}

export const workspaceRecordApi = {
  async create(data: CreateWorkspaceRecordRequest) {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('workspaceId', data.workspaceId.toString());
    formData.append('filePath', data.filePath);
    formData.append('etag', data.etag);
    formData.append('size', data.size.toString());

    return request.post('/workspace-record', formData);
  },

  async update(data: UpdateWorkspaceRecordRequest) {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('workspaceId', data.workspaceId.toString());
    formData.append('filePath', data.filePath);
    formData.append('etag', data.etag);
    formData.append('size', data.size.toString());

    return request.put(`/workspace-record/${data.id}`, formData);
  },

  async getFileTree(workspaceId: number): Promise<FileInfo[]> {
    const { records } = await request.get<{ records: FileInfo[] }>(
      `/workspace-record/tree/${workspaceId}`,
    );
    return records;
  },

  async getRecords(workspaceId: number): Promise<WorkspaceRecordResponse[]> {
    const { records } = await request.get<{ records: WorkspaceRecordResponse[] }>(
      `/workspace-record/list/${workspaceId}`
    );
    return records;
  },

  async syncFiles(workspaceId: number, env: 'dev' | 'test' | 'prod', files: SyncFileInfo[]): Promise<SyncTaskResponse> {
    return request.post(`/workspace-record/sync/${workspaceId}/${env}`, { files });
  },
}; 