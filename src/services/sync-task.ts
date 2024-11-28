import request from '../utils/request';

export interface SyncTaskQueryParams {
  page: number;
  pageSize: number;
  workspaceName?: string;
  fileName?: string;
  filePath?: string;
  modifierName?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export const getSyncTasks = (params: SyncTaskQueryParams) => {
  return request.get('/workspace-record/sync-tasks', { params });
};

export const getSyncTaskDetail = (id: number) => {
  return request.get(`/workspace-record/sync-task/${id}`);
};

export const exportSyncTaskRecords = (id: number) => {
  window.open(`${request.defaults.baseURL}/workspace-record/sync-task/${id}/export`, '_blank');
}; 