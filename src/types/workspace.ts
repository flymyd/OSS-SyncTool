export interface FileInfo {
  id: number;
  name: string;
  size: number;
  modifiedTime: string;
  etag: string;
  isDirectory: boolean;
  children?: FileInfo[]
  path: string
}

export interface WorkspaceResponseDto {
  id: number;
  name: string;
  creator: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
} 