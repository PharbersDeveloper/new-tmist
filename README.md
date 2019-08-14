# new-tmist

<<<<<<< HEAD
This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd new-tmist`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
=======
## 安装
下载完本项目之后，需要将 [BP-Components](https://github.com/PharbersDeveloper/BP-Components.git) 项目下载到本地，并使用 `yarn-link` link 到此项目中。  
**注意**安装本项目依赖的同时，需要安装 `bp-components` 项目的依赖，不然在 `link` 命令之后会出现错误。

## 启动
安装完依赖以及 `link` 进 `bp-components` 之后，在命令行打开项目，输入：  
```terminal
	ember s --pr http://pharbers.com:*****
```
**注意** 其中的`*****`为端口，需要登录 `ssh` 进行查看 `TMIST` 后端服务的位置。
>>>>>>> frank
