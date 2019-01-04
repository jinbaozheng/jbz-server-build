[yum]: http://yum.baseurl.org/wiki/
[yarn]:  https://yarnpkg.com/
[ci-img]:  https://travis-ci.org/cuppi/postcss-ketchup.svg
[ci]:      https://travis-ci.org/cuppi/postcss-ketchup
[npx]:   https://github.com/zkat/npx
[CSS]:     https://developer.mozilla.org/zh-CN/docs/Web/CSS
[Icon]:    http://i-film-beta.oss-cn-shanghai.aliyuncs.com/framework/postcss-ketchup/ketch-icon.png
[postcss-loader]: https://github.com/postcss/postcss-loader
# jbz-server-build [![Build Status][ci-img]][ci]
A cli for make bundle more happy and more comfortable.

## Getting Started
First thing's first, install the environment:
### node
It is good way to install node by package manager, for [yum]: 
```bash
sudo yum install nodejs 
```
> Note: since cli USES the es7 feature, you need to install a later version of 8.0.0 for node. 
### yarn
[yarn] is a fast, reliable, and secure dependency management:
```bash
npm install yarn -g
```
### other
```json
"scripts": {
    "smart-build-beta": "jbz-oss-build beta",
    "smart-build-pro": "jbz-oss-build pro",
    ...
}
```
> Cli will depend heavily on specific script commands in the package.json file in the project, so it is important to contact the project leader to implement the build script.
> The command "smart-build-beta" and "smart-build-pro" are used during packaging.

## Usage

There are several ways to use this command:

### npx
the simplest way to use:

first, you just need install a npx package globaly.

install:
```bash
npm install -g npx
```
or
```bash
yarn global add npx
```
and then, just a little command

```bash
npx jbz-server-build beta --path='path/to/project'
```

### global package

you can also use it as a global package

install:
```bash
npm install -g jbz-server-build
```
or
```bash
yarn global add jbz-server-build
```
and then, you will use it just like any other commands like ls, pwd, etc.
```bash
jbz-server-build beta --path='path/to/project'
```
> Note: the jbz-server-build is a global package, so do not use it as a local package installation

### source

Sometimes, you just just want a simple file to do everything thing packaging process,
Therefore, you can use the source file to do.
```bash
git clone git@github.com:jinbaozheng/jbz-server-build.git
node ./index.js beta --path='path/to/project'
```

## Config
jbz-server-build has a number of options that you can use,
which you can view with the help command 
```bash
jbz-server-build -h
```

```text
    Usage: jbz-server-build [COMMAND] [Options] [args]
    Commands:
      beta         打包测试版本
      pro          打包生产版本
      all          打包双版本
      clear        清除打包文件及依赖包文件
      install      安装依赖包

    Options:
      --uninstall    不进行安装依赖包

    args:
      --path         项目路径

    Aliases:
      -    install
```
> Note: By default, path USES the current directory as the root of the project,
and the path parameter USES the relative path of the current directory to find the project root path.  