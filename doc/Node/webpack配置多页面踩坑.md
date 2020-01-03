---title: 在 CRA@3.2.0 中配置 webpack 多页面踩坑 ---tag: webpack,多页面,CreatReactApp ---start

记录在 CreatReactApp@3.2.0 创建的项目里配置 webpack`多页面`时的坑。

---end

## 场景

在 create-react-app@3.2.0 创建的 React 项目中，通过配置 webpack 来构建多页面应用。

假设有三个页面：_page1_、_page2_、_page3_

#### 主要目录结构为

```
my-app
├── src
│   └── pages
│       ├── page1
│       │  ├── App.tsx
│       │  └── index.tsx
│       ├── page2
│       │  ├── App.tsx
│       │  └── index.tsx
│       └── page3
│          ├── App.tsx
│          └── index.tsx
└── public
    ├── page1.html
    ├── page2.html
    └── page3.html
```

#### 动态读取页面

在 _config/paths.js_ 内重新定义`appIndexJs`和`appHtml`

启动时通过 fs 读取 src/pages 目录的子文件夹，若是子文件夹有 index.tsx 则认为该子文件夹是一个页面模块目录，以目录名作为页面名，并以`public/${页面名}.html`作为 html 模板

则运行结果大致为

```js
// paths.js
module.exports = {
  // ...
  appIndexJs: [
    {
      name: 'page1',
      index: '/absolute path/src/pages/page1/index.tsx'
    },
    {
      name: 'page2',
      index: '/absolute path/src/pages/page2/index.tsx'
    },
    {
      name: 'page3',
      index: '/absolute path/src/pages/page3/index.tsx'
    }
  ],
  appHtml: [
    {
      template: '/absolute path/public/page1.html',
      filename: 'page1.html',
      name: 'page1'
    },
    {
      template: '/absolute path/public/page2.html',
      filename: 'page2.html',
      name: 'page2'
    },
    {
      template: '/absolute path/public/page3.html',
      filename: 'page3.html',
      name: 'page3'
    }
  ]
};
```

#### 配置 webpack.config.js

则修改 _config/webpack.config.js_ 为

```js
const paths = require('./paths');
module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  // ...others
  const defaultEntry = [isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient')].filter(Boolean);
  return {
    // ...others
    entry: paths.appIndexJs.reduce((pre, { name, index }) => {
      pre[name] = [...defaultEntry, index];
      return pre;
    }, {}),
    output: {
      // 如下output为Create React App 默认的配置
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : isEnvDevelopment && 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js'
      // ...
    },
    plugins: [
      ...paths.appHtml.map(({ template, filename, name }) => {
        return new HtmlWebpackPlugin({
          template,
          filename,
          chunks: [name]
          // ...others
        });
      })
    ]
  };
};
```

## 问题

#### 一、编译失败

##### 问题表象

- 1、运行`yarn run start` 启动 devServer 时，命令行一直卡顿在`Starting the development server...`状态，无法继续编译，经过控制变量法（修改了 entry 和 HtmlWebpackPlugin）排查，发现只要 entry 里面有`main`为 key 的入口，则会正常编译

- 2、运行`yarn run build` 构建项目时发生错误

![failed-build](img/failed-build.png)

##### 分析原因

由上面两条得出，在编译时期发生了错误，错误信息为`build`时打印出来的：对*undefined*调用了*filter*，而`start`没有报错反而卡顿住了估计是 devServer 的一些内部原因，那我们对`webpack.config.js`进行错误排查，根据错误信息 2，对`undefined`调用了`filter`，那我们就搜索`.filter`这个串，对结果依次排查，发现如下问题

![manifestPluginError](img/manifestPluginError.png)

关键就在于其中的`entrypoints.main.filter`，这个`entrypoints`是每个 entry 生成的 bundle 文件的集合对象，然而我们的 entry 里并没有`main`这个 key，所以就报错了。 CreateReactApp@3.1.3 加入了这行代码，详情请见 [#7721](https://github.com/facebook/create-react-app/pull/7721)。

##### 解决问题

这个 ManifestPlugin 主要是生成资源映射配置，服务于`Workbox`用于离线访问的，然而这个离线访问这个功能其实并不重要，故而为了快速解决问题，直接将之注释就好了，恢复成 CreatReactApp@3.1.3 以前的样子如下：

![manifestPluginFix](img/manifestPluginFix.png)

项目启动成功！问题解决！

#### 二、页面空白

##### 问题表象

- 1、除了 page1.html 正常显示，其他所有页面都显示一片空白，bundle 并没有执行。

- 2、page1.html、page2.html、page3.html 页面上所引用的 bundle 如下:

![bundle-page1](img/bundle-page1.png) ![bundle-page2](img/bundle-page2.png) ![bundle-page3](img/bundle-page3.png)

##### 分析原因

除了 page1 成功，其他都空白页面，我们观察到，这三个页面引用的 bundle 为`bundle.js`、`0.chunk.js`、`${name}.chunk.js`。

其中`bundle.js`为入口文件，`0.chunk.js`为公共 chunk 代码，`${name}.chunk.js`为每个页面各自的代码。我们发现，公共 chunk 代码三个页面是一样的没有问题，但是三个页面各自的入口文件都为同一个`bundle.js`是不对的，这个`bundle.js`生成是由 webpack config 中的`ouput.filename`决定的。

然后我们查看`webpack.config.js`的`output.filename`如下：

![output.filename](img/output.filename.png)

在`development`模式下，`filename`固定为`static/js/bundle.js`，问题找到了

##### 解决问题

在`development`模式下，将`filename`改为`static/js/[name].bundle.js`即可，为每一个 bundle 独立命名。

项目启动，查看 page1.html、page2.html、page3.html 均引用各自的`[name].bundle.js`并成功显示对应的内容，问题解决！
