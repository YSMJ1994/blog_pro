---tag: React,组件库,脚手架
---start

使用[create-react-ui](https://www.npmjs.com/package/create-react-ui)脚手架工具快速构建一个自己的 React 组件库

---end

## 创建一个 React 组件库

[create-react-ui](https://www.npmjs.com/package/create-react-ui)可以快速构建一个类似[ant-design-react](https://ant.design/docs/react/introduce-cn)的 React 组件库，可配置使用`sass`或`less`作 css 预编译处理器、使用 typescript 和支持[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)按需加载，并预设一个组件库文档。

使用[yarn create](https://yarnpkg.com/zh-Hans/docs/cli/create)

```bash
yarn create react-ui my_ui
```

##### 然后在接下来的命令行交互中选择几个预设的配置

![配置](img/choose_config.png)

##### 查看效果

```bash
cd my_ui
yarn start
```

![文档效果](img/doc.png)

##### 目录结构

![目录结构](img/dir_tree.png)

## 添加一个文档

在`doc`目录下添加一份`.md`结尾的文件即可，文件头部可以按照既定的格式添加对该文档的描述，如`quickStart.md`

![doc目录](img/dir_doc.png) ![doc文档](img/doc_demo.png)

`---config ---`为该文档配置，以`key: value`的方式设置，可配置的 key 有：

- `name`为文档的标题，如果不设置则默认为文件名，显示在 web 文档的左侧列表中；
- `order`为文档的排序权重，按从小到大排序，如果不设置或相等则按照`name`的字母表排序。

`---dependencies ---`为该文档的组件依赖，文档内可以使用我们在`components`目录下定义的 React 组件，前提是，在`dependencies`里面配置的对应的依赖。例如`quickStart.md`中引入的`Button`组件。webpack 配置了别名`components`指向`components`目录。

其他则以`markdown`的语法书写即可

启动`start`脚本后，对于`doc`目录下的`.md`结尾的文件的新增、添加、修改、删除均可在 web 上自动更新

> 只在`doc`文件下以`.md`结尾的文件有效，嵌套目录内不会识别

## 添加一个组件

你可以在`components`目录内添加任意内容，并且均会被构建至最终的组件库中，但仅仅在`components`目录下的目录，并且该目录内拥有`index.md`和`index.{j|t}sx`文件的时候，该目录才会被识别为一个组件目录，而组件的入口文件即为`index.{jt}sx`，组件的文档即为`index.md`。

例如内置的`Button`组件：

![Button组件](img/comp_button.png)

仅仅拥有一个`markdown`格式的组件文档不足以形象地描述一个组件的使用方式，故而借鉴`ant-design`的组件 demo 的方式，在组件目录下的`demo`目录内，可以以`.md`结尾的文件，建立组件的使用样例。

例如`Button`组件的`demo`：

![Button的demo](img/comp_demo.png)

##### `components/*/index.md`组件文档的说明

组件文档的配置方式与`doc`下的文档类似，同样是以`---config ---`的格式定义文档说明。可配置的 key 有：

- `order` 为排序权重，不传则以`name`的字母表排序
- `name` 为组件名，不传则以目录名称作为组件名
- `type` 为组件分类，不传则默认为`未分配`
- `sub` 为组件的中文名，不传则不显示

组件文档中可以自定义该组件的所有`demo`的位置，我们使用`<!-- demo -->`作为占位符，如果没有该占位符，则放置在文档的末尾。

例如`components/Button/index.md`：

![Button文档](img/button_doc.png)

##### `components/*/demo/\*.md`组件 demo 的说明

demo 文档同样以`---config ---`格式定义文档说明。可配置的 key 有：

- `order` 为排序权重，不传则以`title`的字母表排序
- `title` 为 demo 的标题，不传则以目录名称作为标题名

demo 文档的`React`代码以及`css`代码以`markdown`语法中`code`的形式书写。 <code>\```{jt}sx\```</code> 的语法书写`React组件`、<code>\```(css|sass|scss|less)\```</code>的语法写`css`，而其它内容则会被解析为该 demo 的说明。

`React`代码中 webpack 配置了别名:

- `${require(package.json).name}$`指向一个自动生成的导出所有组件的 index.js 文件
- `${require(package.json).name}`指向`components`目录

例如`components/Button/demo/basic.md`：

![组件demo文档](img/comp_demo_content.png)

启动`start`脚本后，对于`components`目录下`组件文档`和`demo文档`的新增、添加、修改、删除均可在 web 上自动更新

## 文档的静态文件

`cru.config.js`中`static.doc`目录为指定的构建文档时的静态文件所在的目录，默认`public`,构建组件库文档时，会将该目录下的所有文件&文件夹都复制到输出目录中。

## 组件库的静态文件

`cru.config.js`中`static.library`目录为指定的构建组件库时的静态文件所在的目录，默认`libraryStatic`,构建组件库时，会将该目录下的所有文件&文件夹都复制到输出目录中。

## 构建

执行`build`脚本即可同时构建文档和 Library，分别在`cru.config.js`中`output.doc`和`output.library`目录中。`build-doc`和`build-library`脚本则是分别构建。

例如：

![输出目录](img/dir_build.png)

doc 的 publicPath 可以在`.env.production`中配置`CRU_PUBLIC_URL`修改，构建后即可上传至服务器托管部署。

而发布组件库则可命令行进入`build-library`目录，执行 npm publish 来发布到 npm 服务器。

## 如何使用已经发布的组件库

跟 `ant-design`一样即可。

比如：

```jsx harmony
import { Button } from 'my_ui';

const Comp = () => {
  return <Button>按钮</Button>;
};
```

##### `babel-plugin-import`配置

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      'import',
      {
        // my_ui换成自己库的名字
        libraryName: 'my_ui',
        // 关闭自动驼峰转换
        camel2DashComponentName: false,
        // 使用es目录下的组件
        libraryDirectory: 'es',
        // 加载 es/组件/style/css.js样式
        style: 'css'
      },
      // 插件别名，多个import插件要不一样
      'import-for-my_ui'
    ]
  ]
};
```
