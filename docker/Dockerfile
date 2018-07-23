FROM harbor.qianfan123.com/base/nginx:1.15.1-node-9.11.2-alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# BASE
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV GLIBC_PKG_VERSION=2.25-r0
RUN set -ex && \
        curl -Lo /etc/apk/keys/sgerrand.rsa.pub http://dposdev.host.hddomain.cn/tools/dockerhome/glibc/${GLIBC_PKG_VERSION}/sgerrand.rsa.pub && \
        curl -Lo glibc-${GLIBC_PKG_VERSION}.apk http://dposdev.host.hddomain.cn/tools/dockerhome/glibc/${GLIBC_PKG_VERSION}/glibc-${GLIBC_PKG_VERSION}.apk && \
        curl -Lo glibc-bin-${GLIBC_PKG_VERSION}.apk http://dposdev.host.hddomain.cn/tools/dockerhome/glibc/${GLIBC_PKG_VERSION}/glibc-bin-${GLIBC_PKG_VERSION}.apk && \
        curl -Lo glibc-i18n-${GLIBC_PKG_VERSION}.apk http://dposdev.host.hddomain.cn/tools/dockerhome/glibc/${GLIBC_PKG_VERSION}/glibc-i18n-${GLIBC_PKG_VERSION}.apk && \
        apk add glibc-${GLIBC_PKG_VERSION}.apk glibc-bin-${GLIBC_PKG_VERSION}.apk glibc-i18n-${GLIBC_PKG_VERSION}.apk && \
        /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8

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
