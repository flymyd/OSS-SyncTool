import {lazy} from 'react'
import {
  AppstoreOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons'
import type {RouteObject} from 'react-router-dom'

const Home = lazy(() => import('../pages/Home'))
const WorkspaceList = lazy(() => import('../pages/WorkspaceList'))
const Profile = lazy(() => import('../pages/Profile'))
const Upload = lazy(() => import('../pages/Upload'))
const Settings = lazy(() => import('../pages/Settings'))
const WorkspaceRecord = lazy(() => import('../pages/WorkspaceRecord'))

export type AppRoute = RouteObject & {
    key?: string
    icon?: React.ReactNode
    label?: string
    children?: AppRoute[]
    hideInMenu?: boolean
}

// 创建一个高阶组件来注入props
const withDashboardProps = (Component: React.ComponentType<any>, props: any) => {
    return () => <Component {...props} />
}

export const createDashboardRoutes = (props: {
    onCreateWorkspace: () => void
    currentWorkspace: string
    onWorkspaceSelect: (workspace: { name: string; id: number }) => void
}) => {
    return [
        {
            path: 'home',
            key: 'home',
            icon: <HomeOutlined />,
            label: '首页',
            element: withDashboardProps(Home, {
                onCreateWorkspace: props.onCreateWorkspace,
                currentWorkspace: props.currentWorkspace
            })()
        },
        {
            path: 'workspaces',
            key: 'workspaces',
            icon: <AppstoreOutlined />,
            label: '工作区列表',
            element: withDashboardProps(WorkspaceList, {
                onWorkspaceSelect: props.onWorkspaceSelect
            })()
        },
        {
            path: 'upload',
            key: 'upload',
            icon: <UploadOutlined />,
            label: '上传管理',
            element: <Upload />
        },
        {
            path: 'record',
            key: 'record',
            icon: <FileTextOutlined />,
            label: '工作区记录',
            element: <WorkspaceRecord />
        },
        // {
        //     path: 'profile',
        //     key: 'profile',
        //     icon: <UserOutlined />,
        //     label: '用户资料',
        //     element: <Profile />
        // },
        // {
        //     path: 'settings',
        //     key: 'settings',
        //     icon: <SettingOutlined />,
        //     label: '设置',
        //     element: <Settings />
        // },
        {
            path: '',
            key: 'default',
            element: withDashboardProps(Home, {
                onCreateWorkspace: props.onCreateWorkspace,
                currentWorkspace: props.currentWorkspace
            })(),
            hideInMenu: true
        }
    ] as AppRoute[]
}
