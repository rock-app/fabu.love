FROM node:10.15.3

# 安装依赖库
RUN npm install -g babel-cli \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org
# 设置目录
RUN mkdir -p /opt/data /opt/server /opt/web /opt/logs /var/cache/nginx/client_temp


# 增加前端页面显示
WORKDIR /opt/client
ADD client /opt/client
RUN cnpm install
RUN npm run build

# 增加server
WORKDIR /opt/server
ADD server /opt/server
# RUN cnpm install && cnpm install bcrypt@latest --save
RUN cnpm install

# 增加前端页面到server
# ADD client/dist /opt/web
# ADD docker/nginx/fabulove.conf /etc/nginx/conf.d/fabulove.conf

EXPOSE 9898

# ENTRYPOINT ["/opt/server/docker-entrypoint.sh"]
CMD ["npm", "start"]
