# remotely serve web deployment

## 1. back-end environment deployment
### 1.1 Installation environment
```
pip3 install -r ./backend/requirements.txt
```
### 1.2 Backend startup
```
cd backend
nohup python3 app_padding.py > nohup.out
```


## 2. front-end environment deployment -- ubuntu version
### 2.1 Local debugging operations
```
2.1 for local debugging, if you need to deploy a server see 2.2

1. install node.js
    1.1 Installation guide：https://blog.csdn.net/Doudou_Mylove/article/details/103343883
    1.2 Installation steps：
    1.2.1 sudo apt-get update
    1.2.2 sudo apt-get install -y nodejs
    1.2.3 Other commands：
    Check the node version number： node -v （the deployed server uses the version number：v16.7.0）

2. install yarn：
    2.1 Installation command：npm install -g yarn --registry=https://registry.npm.taobao.org
    2.1 Installation guide：https://www.jianshu.com/p/ca79e7ca38a4

3. Local debugging startup：
    3.1 Switching the boot path： cd frontend
    3.2 Installing dependencies：yarn install
    3.3 Start：yarn serve

4. frontend home page file path: \frontend\src\views\Home.vue

```
### 2.2 ubuntu server deployment
```
0. Install node.js
    1.1 Installation guide：https://blog.csdn.net/Doudou_Mylove/article/details/103343883
    1.2 Installation steps：
    1.2.1 sudo apt-get update
    1.2.2 sudo apt-get install -y nodejs
    1.2.3 Other commands：
    Check the node version number： node -v （deployed server uses version number: v16.7.0）

1. install yarn：
    1.1 Installation command：npm install -g yarn --registry=https://registry.npm.taobao.org
    1.1 Installation guide：https://www.jianshu.com/p/ca79e7ca38a4

2. install nginx: 
    2.1 Installation guide：https://zhuanlan.zhihu.com/p/138007915
    2.2 Installation steps：
        2.2.1 Installation commands
            sudo apt update
            sudo apt install nginx
            Once the installation is complete, Nginx will be started automatically, and its status can be checked using "sudo service nginx status".

        2.2.2  Other commands
            To see if nginx is up: sudo service nginx status
            start: sudo service nginx start
            Stop: sudo service nginx stop
            Restart: sudo service nginx restart
            To see which ports are occupied by nginx: sudo netstat -anp|grep nginx

        2.2.3 Configure the firewall:
            sudo ufw allow 'Nginx Full'

        2.2.4 Testing：
            nginx is enabled on port 80 by default. Open http://159.75.201.35 and you will see "welcome to nginx", which means nginx is successfully installed.

        2.2.5 Configuring nginx
            2.2.5.0 To avoid permission problems, change the default nginx username www-data to the current username ubuntu:
                cd /etc/nginx
                vim nginx.conf
                    #user www-data;
                    user ubuntu;

            2.2.5.1 Default configuration file path: cd /etc/nginx/sites-enabled/

            2.2.5.2 Rewrite the default configuration file "default" to change the listening port from the default 80 to 8080:
                Specify as：
                    In the original configuration file：
                        listen 8080 default_server;
                        listen [::]:8080 default_server;
                    After the change：
                        listen 8080 default_server;
                        listen [::]:8080 default_server;
                The full documentation of the changes can be found at：./setup-tools-ubuntu/default

            2.2.5.3 Create a new configuration file: vim padding, with the following contents：
                    server {
                                listen 80;      # Listen to the port, the port number for browser access
                                #server_name 127.0.0.1;
                                server_name 159.75.201.35;
                                #path to the dist folder generated after packaging the front-end code with yarn build
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
                                    # Set the cache folder size, if it is larger than this value, it will be passed from the upstream server
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

                 For full documentation see：./setup-tools-ubuntu/padding

            2.2.5.4 Associated startup files：sudo ln -s /etc/nginx/sites-available/padding /etc/nginx/sites-enabled/

3. package the frontend code：
    3.1 cd frontend
    3.2 Generate folder dist： yarn build

4. Restart nginx:
    sudo service nginx restart
    

5. Access with a browser： http://159.75.201.35
```


## 3. Front-end environment deployment -- windows version
### 3.1 Local debugging operations
```
3.1 for local debugging, if you need to deploy the server view 3.2

1. install environment node.js
    1.1 Installation guide：https://www.huaweicloud.com/articles/12573841.html
    The download package has been placed in  ./setup-tools/node-v14.17.0-x86.msi

2. Installing yarn：
    2.1 Installation command：npm install -g yarn --registry=https://registry.npm.taobao.org
    2.1 Installation guide：https://www.jianshu.com/p/ca79e7ca38a4

3. Local debugging startup：
    3.1 Switching the startup path： cd frontend
    3.2 Installing dependencies：yarn install
    3.3 Start：yarn serve

4. Frontend home page file path description：\frontend\src\views\Home.vue

```
### 3.2 Server deployment
```
1. Install nginx: The download package is already placed in ./setup-tools/nginx-1.18.0

2. Package the frontend code：
    2.1 cd frontend
    2.2 Generate folder dist： yarn build

3. configure the nginx configuration file: 
    3.1 Configuration file path: your local installation path \nginx-1.18.0\conf\nginx.conf
    3.2 Add configuration content to the configuration file:  ./frontend/docker-materials/nginx-padding.conf
    3.3 Change the configuration file as follows: ./setup-tools/nginx.conf

4. Start nginx:
    4.1 windows:  
        4.1.1 Initial startup: .\nginx.exe
        4.1.2 Restart： .\nginx.exe -s reload
    4.2 centos: 
        4.2.1 Initial startup:sudo service nginx start
        4.2.2 Restart: sudo service nginx restart

5. browser access ip
```


## Server address change
### Front-end
```
Path：frontend\src\views\Home.vue
Variable： Replace "http://159.75.201.35" with the actual ip used

```
### nginx
```
nginx configuration file "server_name 159.75.201.35;", replace it with the actual ip
```

### backend
```
The server address for sending email requests, change it to the current ip according to actual needs
Path: backend\send_mail_module.py
Variable: self.server_ip = "http://159.75.201.35", here replace with actual ip
```

