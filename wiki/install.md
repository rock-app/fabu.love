安装部署

* 安装MongoDB
* 安装Nodejs
* 安装pm2

1.clone下载代码

```java
//进入项目根目录

npm install  //安装依赖

//配置前端接口请求的baseUrl和后端运行的端口号
node app config -u https://fabu.love -p 9898 

//启动项目
node app start -i -b
```

2.配置nginx

可以按照项目根目录的fabu\_nginx.conf文件进行配置

```bash
server{
  listen 80;
  server_name fabu.love;

  #root目录为项目根目录的client/dist目录下
  root /home/ubuntu/fabulove/client/dist;
  index index.html;

  location / {
      try_files $uri $uri/ @router;
      index index.html;
  }

  location /upload/ {
      #该目录为根目录下config文件里配置的文件上传目录
      #或者使用node app config 配置的updateDir
      root /home/ubuntu/fabulove/upload
      expires  30d;
  }

  location @router {
      rewrite ^.*$ /index.html last;
  }


  location /api/ {
    proxy_pass http://127.0.0.1:8383;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  client_max_body_size 208M; 
}
```



