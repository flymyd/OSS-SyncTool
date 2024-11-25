export interface FileInfo {
  name: string
  size: number
  modifiedTime: string
  etag: string
  isDirectory: boolean
  children?: FileInfo[]
  path: string
} 