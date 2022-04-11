# README

## 1. 后端环境部署
### 1.1 安装环境
```
pip3 install -r ./backend/requirements.txt
```
### 1.2 后端启动
```
cd backend
python3 app_padding.py
```
```
windows下 后台运行： pythonw app_padding.py > nohup.out

```

### 2. 前端环境部署
### 2.1 本地调试操作
```
此步骤为本地调试，如果需要部署服务器看 2.2

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
### 2.2 服务器部署
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
变量： 将 "http://170.106.83.3" 替换成 实际使用ip

```
### nginx
```
nginx 配置文件中 "server_name 170.106.83.3;", 替换成实际使用ip
```

### 后端
```
发送邮件请求的服务器地址，按实际需求更改成当前使用的ip
路径：backend\send_mail_module.py
变量：self.server_ip = "http://170.106.83.3"， 这里替换成实际使用ip
```

