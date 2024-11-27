import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import type { RootState } from '../store';
import { clearWorkspaceState } from '../store/slices/workspaceSlice';
import { getWorkspaces } from '../services/workspace';

export const useWorkspaceCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentWorkspaceId = useSelector((state: RootState) => state.workspace.currentWorkspaceId);

  useEffect(() => {
    const checkWorkspace = async () => {
      if (!currentWorkspaceId) return;

      try {
        const workspaces = await getWorkspaces();
        const workspaceExists = workspaces.some(w => w.id === currentWorkspaceId);
        
        if (!workspaceExists) {
          message.error('当前工作区不存在，可能已被删除');
          dispatch(clearWorkspaceState());
          navigate('/dashboard/workspaces');
        }
      } catch (error) {
        console.error('检查工作区失败:', error);
      }
    };

    checkWorkspace();
  }, [currentWorkspaceId, dispatch, navigate]);
}; 