FROM harbor.qianfan123.com/base/nginx:1.15.1-node-9.11.2-alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# 安装依赖库
RUN npm install -g pm2 babel-cli \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org
# 设置目录
RUN mkdir -p /opt/data /opt/server /opt/web /opt/logs

# 增加启动脚本
ADD docker/docker-entrypoint.sh /opt/server/
RUN chmod +x /opt/server/docker-entrypoint.sh

# 增加server
WORKDIR /opt/server
ADD server /opt/server
ADD config.json /
RUN cnpm install

# 增加nginx前端页面
ADD client/dist /opt/web
ADD docker/app-publisher.conf /etc/nginx/conf.d/default.conf

EXPOSE 9898 80 443

ENTRYPOINT ["/opt/server/docker-entrypoint.sh"]
#CMD ["nginx", "-g", "daemon off;"]
