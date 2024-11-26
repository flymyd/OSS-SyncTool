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