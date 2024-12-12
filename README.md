---
typora-copy-images-to: ./screenshots
---

# 本地调试镜像
### 本地调试镜像
```shell

COMPOSE_DOCKER_CLI_BUILD=1 \
DOCKER_BUILDKIT=1 \
DOCKER_DEFAULT_PLATFORM=linux/amd64 \
docker-compose up -d --build
```

# 如何自己编译镜像
### 编译镜像
```shell

docker buildx build -t fabulove:202411272235 --platform=linux/amd64 -f docker/Dockerfile .

```

### 推送镜像
```shell

docker push fabulove:202411272235

```

### 修改 docker-compose.yml
* image 改为 fabulove:202411272235
* FABU_BASE_URL 改为自己的域名

### 运行镜像
在 docker 目录下, 运行 docker-compose 命令

```shell

cd docker
docker-compose up -d

```

# 运行
docker-compose (使用构建好的镜像)
```yaml

services:
  mongo:
    platform: "linux/amd64"
    container_name: mongo
    image: mongo:4.4.7
    volumes:
      - ./data:/data/db
    ports:
      - "27017:27017"
    networks:
      - appnet

  server:
    image: answerhuang/fabulove:2.0.0
    container_name: docker_server
    environment:
      FABU_DB_HOST: mongo
      FABU_BASE_URL: https://server.docker.orb.local/ #正式环境部署请打开注释，并修改为域名为自己的域名
      FABU_UPLOAD_DIR: /fabu/upload
    ports:
      - "9898:9898"
    volumes:
      - ./upload:/fabu/upload
    depends_on:
      - mongo
    networks:
      - appnet

networks:
  appnet:
    driver:
      bridge




```

docker-compose (自己编译镜像)
```yaml

services:
  mongo:
    platform: "linux/amd64"
    container_name: mongo
    image: mongo:4.4.7
    volumes:
      - ./data:/data/db
    ports:
      - "27017:27017"
    networks:
      - appnet

  server:
    build:
      context: ../
      dockerfile: docker/Dockerfile
    container_name: docker_server
    environment:
      FABU_DB_HOST: mongo
      FABU_BASE_URL: https://server.docker.orb.local/ #正式环境部署请打开注释，并修改为域名为自己的域名
      FABU_UPLOAD_DIR: /fabu/upload
    ports:
      - "9898:9898"
    volumes:
      - ./upload:/fabu/upload
    depends_on:
      - mongo
    networks:
      - appnet

networks:
  appnet:
    driver:
      bridge




```

# 更新:

### V2.1 2024年 11月 17
fix: 修复 iOS 新版本 ipa 包获取不到 icon 导致上传失败问题

### V2.0 2021年08月22日
feature: 打包方式升级为 vite.

feature: node 版本升级至 12.18.1

feature: APP 详情页面最多显示 500条记录.

feature: 删除APP指定版本时, 同时删除对应安装文件.

feature: 新增下载页面显示最多50条历史记录, 并支持点击安装.

fix: 更新 aapt-osx 版本, 支持在 macOS 系统本地调试.

fix: 优化部分逻辑.

### 爱发布


demo地址: https://fabu.apppills.com/
该平台是类似于fir.im/蒲公英类似的一个平台.可以自己部署.



项目前后端分离开发:

前端使用 vue + element-plus

后端使用 nodejs + koa

![Artboard](./screenshots/Artboard.png)

### 项目结构

```
.
├── LICENSE
├── README.md
├── client //web端代码 vue + element UI
├── docker  //使用docker部署的配置文件
├── fabu_nginx.conf  //server端nginx配置文件
├── screenshots  //屏幕截图
├── server  //服务端代码node+koa
└── wiki //todo 还在编写中
```

### 运行步骤

#### 使用docker运行（建议）

> ps：请先安装docker
1. 下载源码  `git clone https://github.com/rock-app/fabu.love`
2. 执行`cd docker`
3. 执行`docker-compose up -d --build`
4. 打开浏览器 http://0.0.0.0:9898


#### 本地运行

运行前准备

* 安装 MongoDB (3.6)
* 安装 Nodejs
* 安装 pm2、babel-node

```bash
npm install -g pm2 babel-cli
```

* 安装 cnpm

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

1.clone 下载代码 `git clone https://github.com/rock-app/fabu.love`

2.运行server端

```bash
#进入项目根目录
cd server
cnpm install  #安装依赖
npm start

=============>>out
...
...
App is listening on 9898.
数据库连接成功
=============>>end
```

3.编译运行前端页面

```Bash
cd client
cnpm install
npm run build #正式环境可以用该命令编译静态文件交给nginx
npm run start  #本地运行可以使用该命令

============>>out
...
...
 DONE  Compiled successfully in 18546ms                                                
 I  Your application is running here: http://0.0.0.0:9898
============>>end
```

4.使用浏览器打开进入http://localhost:9898即可进入应用




### 项目配置说明

**前端配置**

无需配置

**后端配置**

参见 server/config.js

```javascript
//需要修改配置可以修改config.js文件,也可以在部署的时候导出环境变量
//比如 export FABU_BASE_URL=https://127.0.0.1:9898

const common = {
    //baseUrl应用请求的url地址,比如https://fabu.love
    baseUrl: process.env.FABU_BASE_URL || "https://127.0.0.1:9898", 
    port: process.env.FABU_PORT || "9898", //server运行的端口
    apiPrefix: 'api',
    fileDir: process.env.FABU_UPLOAD_DIR || path.join(__dirname, ".."), //上传文件的存放目录
    secret: process.env.FABU_SECRET || "secretsecret", //secret
    //数据库用户 (没有开启mongodb用户认证的可以不填写)
    dbUser: process.env.FABU_DBUSER || undefined,  
    //数据库密码 (没有开启mongodb用户认证的可以不填写)
    dbPass: process.env.FABU_DBPWD || undefined,  
    dbName: process.env.FABU_DB_NAME || "fabulove", //数据库名称
    dbHost: process.env.FABU_DB_HOST || "localhost", //数据库地址
    dbPort: process.env.FABU_DB_PORT || "27017", //数据库端口
	
    //邮件相关配置 用于找回密码和邀请团队成员发送邮件
    emailService: process.env.FABU_EMAIL_SERVICE || "qq", 
    emailUser: process.env.FABU_EMAIL_USER || "", 
    emailPass: process.env.FABU_EMAIL_PASS || "",

    //是否允许用户注册,为否则后端注册接口不可用
    allowRegister: process.env.FABU_ALLOW_REGISTER || true, 

    //是否开启ldap 默认是false 如果公司没有ldap服务可以不用理会
    openLdap: process.env.FABU_ALLOW_LDAP || false, 
    ldapServer: process.env.FABU_LDAP_URL || "",  //ldap server url
    ldapUserDn: process.env.FABU_LDAP_USERDN || "", //ldap管理员dn 管理员用户名
    ldapBindCredentials: process.env.FABU_LDAP_CREDENTIALS || "", //ldap管理员密码
    ldapBase: process.env.FABU_LDAP_BASE || "" //ldap base

};
```





### 正式环境部署 nginx配置(注意请使用https部署,否则iOS会出现无法安装的问题)

可以按照项目根目录的 fabu_nginx.conf 文件进行配置

```bash
server{
  listen 80;
  server_name fabu.love;

  #root目录为项目根目录的client/dist目录下,前端静态页面
  root /home/ubuntu/fabulove/client/dist;
  index index.html;

  location / {
      try_files $uri $uri/ @router;
      index index.html;
  }

  location /upload/ {
      #该root目录为根目录下config.json文件里dir目录 上传的apk和ipa文件当作静态文件处理
      root /home/ubuntu/fabulove/upload;
      expires  30d;
  }

  location @router {  # vue的router配置
      rewrite ^.*$ /index.html last;
  }

  location /api/ {  #把以api打头的接口转发给后端server
    proxy_pass http://127.0.0.1:9898; #这里端口修改为后端服务运行的端口
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  client_max_body_size 208M; #最大上传的ipa/apk文件大小
}
```

