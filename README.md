# new-tmist

## 安装
下载完本项目之后，需要将 [BP-Components](https://github.com/PharbersDeveloper/BP-Components.git) 项目下载到本地，并使用 `yarn-link` link 到此项目中。  
**注意**安装本项目依赖的同时，需要安装 `bp-components` 项目的依赖，不然在 `link` 命令之后会出现错误。

## 启动
安装完依赖以及 `link` 进 `bp-components` 之后，在命令行打开项目，输入：  
```terminal
	ember s --pr http://pharbers.com:*****
```
**注意** 其中的`*****`为端口，需要登录 `ssh` 进行查看 `TMIST` 后端服务的位置。
