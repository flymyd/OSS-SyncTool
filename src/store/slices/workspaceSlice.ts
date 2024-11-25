import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WorkspaceState {
  currentWorkspace: string | null;
  currentWorkspaceId: number | null;
}

const initialState: WorkspaceState = {
  currentWorkspace: '请选择工作区',
  currentWorkspaceId: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<{ name: string; id: number }>) => {
      state.currentWorkspace = action.payload.name;
      state.currentWorkspaceId = action.payload.id;
    },
    clearWorkspaceState: (state) => {
      state.currentWorkspace = '请选择工作区';
      state.currentWorkspaceId = null;
    },
  },
});

export const { setCurrentWorkspace, clearWorkspaceState } = workspaceSlice.actions;
export default workspaceSlice.reducer;
