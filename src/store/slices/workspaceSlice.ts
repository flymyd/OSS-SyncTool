import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WorkspaceState {
  currentWorkspace: string | null;
}

const initialState: WorkspaceState = {
  currentWorkspace: '请选择工作区',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<string>) => {
      state.currentWorkspace = action.payload;
    },
    clearWorkspaceState: (state) => {
      state.currentWorkspace = '请选择工作区';
    },
  },
});

export const { setCurrentWorkspace, clearWorkspaceState } = workspaceSlice.actions;
export default workspaceSlice.reducer;
