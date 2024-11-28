# OSS Sync Tool

## 项目简介
oss-sync-tool 是一个用于同步 OSS 数据到不同环境的工具。

## 环境配置
在项目根目录下创建一个 `.env` 文件，配置以下环境变量：
```env
VITE_API_URL=http://localhost:8965
```
`VITE_API_URL`为服务端的端点。

## 项目配置
### 设置 yarn 的全局镜像源为 npmmirror
```bash
yarn config set registry https://registry.npmmirror.com
```

### （如打包Electron版）设置 electron 包的镜像源为 npmmirror
```bash
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/
# 删除package.json
rm package.json
# 将package-electron.json重命名为package.json
mv package-electron.json package.json
```

### 安装依赖
```bash
yarn install
```

### 打包
#### 纯Web版
```bash
yarn run build
```
#### Electron版
```bash
yarn run electron:build
```