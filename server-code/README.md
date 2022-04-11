# README

## 1. 后端环境部署
### 1.1 安装环境
```
pip3 install -r ./backend/requirements.txt
```
### 1.2 后端启动
```
cd backend
nohup python3 app_padding.py > nohup.out
```


## 2. 前端环境部署 -- ubuntu版本
### 2.1 本地调试操作
```
2.1为本地调试，如果需要部署服务器查看 2.2

1. 安装 node.js
    1.1 安装指引：https://blog.csdn.net/Doudou_Mylove/article/details/103343883
    1.2 安装步骤：
    1.2.1 sudo apt-get update
    1.2.2 sudo apt-get install -y nodejs
    1.2.3 其他命令：
    查看node版本号： node -v （已部署的服务器使用的版本号是：v16.7.0）

2. 安装yarn：
    2.1 安装命令：npm install -g yarn --registry=https://registry.npm.taobao.org
    2.1 安装指引：https://www.jianshu.com/p/ca79e7ca38a4

3. 本地调试启动：
    3.1 切换启动路径： cd frontend
    3.2 安装依赖：yarn install
    3.3 启动：yarn serve

4. 前端主页文件路径：\frontend\src\views\Home.vue

```
### 2.2 ubuntu服务器部署
```
0. 安装 node.js
    1.1 安装指引：https://blog.csdn.net/Doudou_Mylove/article/details/103343883
    1.2 安装步骤：
    1.2.1 sudo apt-get update
    1.2.2 sudo apt-get install -y nodejs
    1.2.3 其他命令：
    查看node版本号： node -v （已部署的服务器使用的版本号是：v16.7.0）

1. 安装yarn：
    1.1 安装命令：npm install -g yarn --registry=https://registry.npm.taobao.org
    1.1 安装指引：https://www.jianshu.com/p/ca79e7ca38a4

2. 安装nginx: 
    2.1 安装指引：https://zhuanlan.zhihu.com/p/138007915
    2.2 安装步骤：
        2.2.1 安装命令
            sudo apt update
            sudo apt install nginx
            一旦安装完成，Nginx 将会自动被启动，可以使用 "sudo service nginx status" 查看其状态

        2.2.2 其他命令
            查看nginx是否启动：sudo service nginx status
            启动：sudo service nginx start
            停止：sudo service nginx stop
            重启：sudo service nginx restart
            查看nginx占用哪些端口：sudo netstat -anp|grep nginx

        2.2.3 配置防火墙:
            sudo ufw allow 'Nginx Full'

        2.2.4 测试：
            nginx 默认开启 80 端口， 浏览器打开 http://159.75.201.35 即可看到 "welcome to nginx", 代表nginx安装成功。

        2.2.5 配置nginx
            2.2.5.0 为避免权限问题， 更改 nginx 默认用户名 www-data 为当前用户名 ubuntu:
                cd /etc/nginx
                vim nginx.conf
                    #user www-data;
                    user ubuntu;

            2.2.5.1 默认配置文件路径：cd /etc/nginx/sites-enabled/

            2.2.5.2 改写默认配置文件 "default" 中的监听端口由默认的 80 为8080:
                具体为：
                    原配置文件中：
                        listen 8080 default_server;
                        listen [::]:8080 default_server;
                    更改后：
                        listen 8080 default_server;
                        listen [::]:8080 default_server;
                更改后的完整文件详见：./setup-tools-ubuntu/default

            2.2.5.3 新建一个配置文件: vim padding, 文件内容如下：
                    server {
                                listen 80;      # 监听端口，浏览器访问的端口号
                                #server_name 127.0.0.1;
                                server_name 159.75.201.35;
                                #使用 yarn build 打包前端代码后， 生成的 dist 文件夹的路径
                                root /home/ubuntu/mBrainAligner/server_code/frontend/dist;
                                index index.html;

                                location = /favicon.ico {
                                log_not_found off;
                                access_log off;
                                }
                        
                                location / {
                                    proxy_buffer_size 512k;
                                    proxy_buffers 4 512k;
                                    proxy_busy_buffers_size 512k;
                                    proxy_read_timeout 4800s;
                                    proxy_connect_timeout 4800s;
                                    proxy_send_timeout 4800s;
                                    try_files $uri $uri/ /index.html;
                                }       

                                location /api/ {
                                    # 设定缓存文件夹大小，大于这个值，将从upstream服务器传
                                    proxy_temp_file_write_size 50m;

                                    proxy_set_header Host $host;
                                    proxy_buffer_size 512k;
                                    proxy_buffers 4 512k;
                                    proxy_busy_buffers_size 512k;
                                    proxy_http_version 1.1;
                                    proxy_set_header Connection "0"; 
                                    proxy_read_timeout 4800s;
                                    proxy_connect_timeout 4800s;
                                    proxy_send_timeout 4800s;
                                    #proxy_pass http://127.0.0.1:3000/api/;
                                    proxy_pass http://localhost:3000/api/;
                                    
                            }
                                gzip  on;
                                gzip_min_length  1k;
                                gzip_buffers     4 64k;
                                gzip_http_version 1.1;
                                gzip_comp_level 9;
                                gzip_types       text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/javascript application/json;
                                gzip_disable "MSIE [1-6]\.";
                                gzip_vary on;

                                client_max_body_size   1000m;
                                client_header_buffer_size 10m;
                                large_client_header_buffers 4 512k;
                        }

                完整文件详见：./setup-tools-ubuntu/padding

            2.2.5.4 关联启动文件：sudo ln -s /etc/nginx/sites-available/padding /etc/nginx/sites-enabled/

3. 打包前端代码：
    3.1 cd frontend
    3.2 生成文件夹dist： yarn build

4. 重启nginx:
    sudo service nginx restart
    

5. 使用浏览器访问： http://159.75.201.35
```


## 3. 前端环境部署 -- windows版本
### 3.1 本地调试操作
```
3.1为本地调试，如果需要部署服务器查看 3.2

1. 安装环境 node.js
    1.1 安装指引：https://www.huaweicloud.com/articles/12573841.html
    下载包已放在 ./setup-tools/node-v14.17.0-x86.msi

2. 安装yarn：
    2.1 安装命令：npm install -g yarn --registry=https://registry.npm.taobao.org
    2.1 安装指引：https://www.jianshu.com/p/ca79e7ca38a4

3. 本地调试启动：
    3.1 切换启动路径： cd frontend
    3.2 安装依赖：yarn install
    3.3 启动：yarn serve

4. 前端主页文件路径说明：\frontend\src\views\Home.vue

```
### 3.2 服务器部署
```
1. 安装nginx: 下载包已放在 ./setup-tools/nginx-1.18.0

2. 打包前端代码：
    2.1 cd frontend
    2.2 生成文件夹dist： yarn build

3. 配置nginx配置文件: 
    3.1 配置文件路径：你本地的安装路径\nginx-1.18.0\conf\nginx.conf
    3.2 向配置文件中添加配置内容：见 ./frontend/docker-materials/nginx-padding.conf
    3.3 更改后的配置文件如： ./setup-tools/nginx.conf

4. 启动nginx:
    4.1 windows:  
        4.1.1 初次启动: .\nginx.exe
        4.1.2 重启： .\nginx.exe -s reload
    4.2 centos: 
        4.2.1 初次启动:sudo service nginx start
        4.2.2 重启: sudo service nginx restart

5. 浏览器访问ip
```


## 服务器地址更改
### 前端
```
路径：frontend\src\views\Home.vue
变量： 将 "http://159.75.201.35" 替换成 实际使用ip

```
### nginx
```
nginx 配置文件中 "server_name 159.75.201.35;", 替换成实际使用ip
```

### 后端
```
发送邮件请求的服务器地址，按实际需求更改成当前使用的ip
路径：backend\send_mail_module.py
变量：self.server_ip = "http://159.75.201.35"， 这里替换成实际使用ip
```

