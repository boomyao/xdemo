FROM nginx:alpine

# 创建工作目录
WORKDIR /usr/share/nginx/html

# 复制静态文件到容器中
COPY . .

# 使用默认的 nginx 配置
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
