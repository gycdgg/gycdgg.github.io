---
title: 服务器配置step by step
date: 2018-07-27 11:08:18
tags: 点滴
category: JavaScript
---

## 序。。。
阿里云到期了，最近做活动，乞丐版1年不到400，但是只能新买，不能续费（续费的话一年需要800多），之前搭好的服务器环境又要重新弄了,索性记录一下吧，以后也有个手册好操作。
购买的服务器是centos系统

### 安装配置

#### git
> yum -y install git
好像现在阿里云centos自带git了。
我的服务器上只需要clone pull就行了。先不设置用户组权限了

#### pull code

#### 安装node
尽量安装v8以上的版本。
<a href="https://nodejs.org/en/download/">查看nodejs最新版本</a>
* wget  https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-x64.tar.xz
* 解压：依次执行 xz -d node-v8.11.3-linux-x64.tar.xz
tar -xf node-v8.11.3-linux-x64.tar
* 测试是否安装成功，cd bin之后./node -v
* 配置全局path： PATH=$PATH:$HOME/bin:/usr/local/src/node/bin
**配置完成记得重启source ~/.bash_profile**

测试是否安装成功。
```
node -v => v8.11.3
npm -v => 5.6.01. quite
```

#### 安装nginx

> yum install nginx

1. 配置nginx


#### 安装数据库

1. 官网下载最新的mysql linux版本，wget http://repo.mysql.com/mysql80-community-release-el7-1.noarch.rpm

2. yum -y install mysql80-community-release-el7-1.noarch.rpm

3. yum -y install mysql-community-server

4. vim /etc/mycnf.进入之后default-authentication-plugin=mysql_native_password的注释取消

5. 设置临时密码grep 'temporary password' /var/log/mysqld.log 到日志里面

6. mysql -u root -p

7. set global validate_password.policy=0;set global validate_password.length=4;ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'itliuwei'

** 配置数据库权限并建立远程连接**
> grant all privileges on *.* to root@'%' identified by 'test';
> flush provileges.

> alter database chat character set utf8 collate utf8_general_ci
> alter table message convert to character set utf8 collate u.NODEtf8_general_ci