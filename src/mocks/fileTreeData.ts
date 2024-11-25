import { FileInfo } from '../types/workspace'

export const generateMockFileTree = (): FileInfo[] => {
  return [
    {
      name: 'src',
      path: '/src',
      size: 0,
      modifiedTime: '2024-01-15T10:00:00',
      etag: 'dir-1',
      isDirectory: true,
      children: [
        {
          name: 'components',
          path: '/src/components',
          size: 0,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'dir-2',
          isDirectory: true,
          children: [
            {
              name: 'Button.tsx',
              path: '/src/components/Button.tsx',
              size: 2.5 * 1024,
              modifiedTime: '2024-01-15T10:30:00',
              etag: 'file-1',
              isDirectory: false,
            },
            {
              name: 'Input.tsx',
              path: '/src/components/Input.tsx',
              size: 3.2 * 1024,
              modifiedTime: '2024-01-15T11:00:00',
              etag: 'file-2',
              isDirectory: false,
            },
            {
              name: 'Card.tsx',
              path: '/src/components/Card.tsx',
              size: 4.1 * 1024,
              modifiedTime: '2024-01-15T11:30:00',
              etag: 'file-3',
              isDirectory: false,
            }
          ]
        },
        {
          name: 'pages',
          path: '/src/pages',
          size: 0,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'dir-3',
          isDirectory: true,
          children: [
            {
              name: 'Home.tsx',
              path: '/src/pages/Home.tsx',
              size: 5.1 * 1024,
              modifiedTime: '2024-01-15T14:00:00',
              etag: 'file-4',
              isDirectory: false,
            },
            {
              name: 'About.tsx',
              path: '/src/pages/About.tsx',
              size: 2.8 * 1024,
              modifiedTime: '2024-01-15T15:30:00',
              etag: 'file-5',
              isDirectory: false,
            },
            {
              name: 'Dashboard.tsx',
              path: '/src/pages/Dashboard.tsx',
              size: 8.3 * 1024,
              modifiedTime: '2024-01-15T16:45:00',
              etag: 'file-6',
              isDirectory: false,
            }
          ]
        },
        {
          name: 'utils',
          path: '/src/utils',
          size: 0,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'dir-4',
          isDirectory: true,
          children: [
            {
              name: 'request.ts',
              path: '/src/utils/request.ts',
              size: 1.5 * 1024,
              modifiedTime: '2024-01-15T13:20:00',
              etag: 'file-7',
              isDirectory: false,
            },
            {
              name: 'format.ts',
              path: '/src/utils/format.ts',
              size: 0.8 * 1024,
              modifiedTime: '2024-01-15T13:25:00',
              etag: 'file-8',
              isDirectory: false,
            }
          ]
        },
        {
          name: 'App.tsx',
          path: '/src/App.tsx',
          size: 4.3 * 1024,
          modifiedTime: '2024-01-15T16:00:00',
          etag: 'file-9',
          isDirectory: false,
        },
        {
          name: 'index.tsx',
          path: '/src/index.tsx',
          size: 1.2 * 1024,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'file-10',
          isDirectory: false,
        }
      ]
    },
    {
      name: 'public',
      path: '/public',
      size: 0,
      modifiedTime: '2024-01-15T10:00:00',
      etag: 'dir-5',
      isDirectory: true,
      children: [
        {
          name: 'index.html',
          path: '/public/index.html',
          size: 1.8 * 1024,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'file-11',
          isDirectory: false,
        },
        {
          name: 'favicon.ico',
          path: '/public/favicon.ico',
          size: 4.5 * 1024,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'file-12',
          isDirectory: false,
        },
        {
          name: 'assets',
          path: '/public/assets',
          size: 0,
          modifiedTime: '2024-01-15T10:00:00',
          etag: 'dir-6',
          isDirectory: true,
          children: [
            {
              name: 'logo.png',
              path: '/public/assets/logo.png',
              size: 25.4 * 1024,
              modifiedTime: '2024-01-15T10:00:00',
              etag: 'file-13',
              isDirectory: false,
            },
            {
              name: 'background.jpg',
              path: '/public/assets/background.jpg',
              size: 158.7 * 1024,
              modifiedTime: '2024-01-15T10:00:00',
              etag: 'file-14',
              isDirectory: false,
            }
          ]
        }
      ]
    },
    {
      name: 'package.json',
      path: '/package.json',
      size: 1.2 * 1024,
      modifiedTime: '2024-01-15T10:00:00',
      etag: 'file-15',
      isDirectory: false,
    },
    {
      name: 'tsconfig.json',
      path: '/tsconfig.json',
      size: 0.5 * 1024,
      modifiedTime: '2024-01-15T10:00:00',
      etag: 'file-16',
      isDirectory: false,
    },
    {
      name: 'README.md',
      path: '/README.md',
      size: 3.2 * 1024,
      modifiedTime: '2024-01-15T10:00:00',
      etag: 'file-17',
      isDirectory: false,
    }
  ]
} 