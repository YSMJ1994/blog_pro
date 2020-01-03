---tag: npm,yarn,npm 换源
---start

汇总几种 npm 源管理的方案

---end

## 1、使用社区内的 npm 源管理工具

针对常用的包管理器`npm`和`yarn`，社区内已经有现成的 npm 源管理工具包`nrm`和`yrm`，可以便捷的使用命令行切换几个常用的 npm 源，当然也可以自定义添加私有 npm 源。

例如：

```bash
# 查看有哪些npm源
nrm ls
# 切换到淘宝的npm源
nrm use taobao
# 添加一个新的源
nrm add 别名 源地址
# ...其他命令
```

`yrm`和`nrm`的命令基本上都类似，区别是`yrm`可以同时设置`yarn`和`npm`两个包管理器的源，而`nrm`只设置`npm`包管理器的源。

具体请见官方文档 _[nrm](https://www.npmjs.com/package/nrm)_ 、 _[yrm](https://www.npmjs.com/package/yrm)_

## 2、手动设置

直接调用包管理对应的 config 设置命令手动设置源

例如：

#### npm

```bash
# 设置淘宝源
npm config set registry https://registry.npm.taobao.org
# 设置node-sass二进制包源
npm config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
```

#### yarn

```bash
# 设置淘宝源
yarn config set registry https://registry.npm.taobao.org
# 设置node-sass二进制包源
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
```
