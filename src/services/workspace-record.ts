import request from '../utils/request';
import { FileInfo } from '../types/workspace';

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
    const response = await request.get<{ records: FileInfo[] }>(
      `/workspace-record/tree/${workspaceId}`,
    );
    return response.records;
  },
}; 