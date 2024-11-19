FROM node:14

# 安装依赖库
RUN npm install -g babel-cli
# RUN npm install -g npm --registry=https://registry.npmmirror.com
# 设置目录
RUN mkdir -p /opt/data /opt/server /opt/web /opt/logs /opt/docker

# copy docker entrypoint file
WORKDIR /opt/docker
ADD docker/docker-entrypoint.sh /opt/docker

# 增加前端页面显示
WORKDIR /opt/client
ADD client /opt/client
RUN npm install
RUN npm run build

# 增加server
WORKDIR /opt/server
ADD server /opt/server
RUN npm install

EXPOSE 9898

ENTRYPOINT ["/opt/docker/docker-entrypoint.sh"]
