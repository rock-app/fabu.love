FROM node:9.11.2-alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

WORKDIR /server

RUN npm install -g pm2 babel-cli \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org
ADD ../../server /server
ADD ../../config.json /
RUN cnpm install

EXPOSE 9898
CMD ["pm2", "start", "process.json"]
