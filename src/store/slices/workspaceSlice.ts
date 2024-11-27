import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WorkspaceState {
  currentWorkspace: string | null;
  currentWorkspaceId: number | null;
}

// 从 localStorage 读取初始状态
const initialState: WorkspaceState = {
  currentWorkspace: localStorage.getItem('currentWorkspace') || '请选择工作区',
  currentWorkspaceId: localStorage.getItem('currentWorkspaceId') ? Number(localStorage.getItem('currentWorkspaceId')) : null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<{ name: string; id: number }>) => {
      state.currentWorkspace = action.payload.name;
      state.currentWorkspaceId = action.payload.id;
      // 保存到 localStorage
      localStorage.setItem('currentWorkspace', action.payload.name);
      localStorage.setItem('currentWorkspaceId', action.payload.id.toString());
    },
    clearWorkspaceState: (state) => {
      state.currentWorkspace = '请选择工作区';
      state.currentWorkspaceId = null;
      // 清除 localStorage
      localStorage.removeItem('currentWorkspace');
      localStorage.removeItem('currentWorkspaceId');
    },
  },
});

export const { setCurrentWorkspace, clearWorkspaceState } = workspaceSlice.actions;
export default workspaceSlice.reducer;
