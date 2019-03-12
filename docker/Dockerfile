FROM node:10.15-jessie

# 安装依赖库
RUN npm install -g babel-cli \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org
# 设置目录
RUN mkdir -p /opt/data /opt/server /opt/web /opt/logs /var/cache/nginx/client_temp

# 增加库
# RUN apk add --no-cache openssl

# 增加启动脚本
ADD docker/docker-entrypoint.sh /opt/server/
RUN chmod +x /opt/server/docker-entrypoint.sh

# 增加server
WORKDIR /opt/server
ADD server /opt/server
RUN cnpm install

# 增加nginx前端页面
ADD client/dist /opt/web
ADD docker/nginx/fabulove.conf /etc/nginx/conf.d/fabulove.conf

EXPOSE 9898

ENTRYPOINT ["/opt/server/docker-entrypoint.sh"]
#CMD ["nginx", "-g", "daemon off;"]
