# OSS Sync Tool

## 项目简介
oss-sync-tool 是一个用于同步 OSS 数据到不同环境的工具。

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

### 本地开发调试
```bash
# 创建 .env 文件
echo "VITE_API_URL=http://localhost:8965" > .env.local

# 启动开发服务器
yarn dev
```

### Docker构建运行
```bash
# 构建镜像
docker build -t oss-sync-tool .

# 运行容器（可以指定不同的 API_URL）
docker run -d -p 8899:80 -e API_URL=http://IP:端口 oss-sync-tool
# 或
docker-compose up -d
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