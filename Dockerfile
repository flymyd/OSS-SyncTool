# 使用 Node.js 镜像构建应用
FROM node:20 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 设置 Yarn 的 npm 镜像加速
RUN yarn config set registry https://registry.npmmirror.com

# 安装依赖
RUN yarn install

# 复制项目文件
COPY . .

# 构建应用
RUN yarn run build

# 使用 Nginx 镜像来服务构建的应用
FROM nginx:alpine

# 复制构建的文件到 Nginx 的 html 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件模板
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 复制环境变量配置文件
COPY public/env-config.js /usr/share/nginx/html/env-config.js

# 设置环境变量
ENV API_URL=http://121.41.170.75:8965

# 创建启动脚本
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'sed -i "s|\${API_URL}|$API_URL|g" /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.sh && \
    echo 'envsubst "\${API_URL}" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# 暴露 Nginx 端口
EXPOSE 80

# 使用启动脚本
CMD ["/docker-entrypoint.sh"]