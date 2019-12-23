[tag]: #(Worker,javascript,js)
[preview]: #(start)

记录使用`Worker`线程来实现博客搜索功能的经历。

[preview]: #(end)

## `Web Workers API`介绍

`Web Workers API`说白了就是浏览器给 JS 开发者提供了再开一个线程执行某些操作的机制。因为浏览器每个进程(即每个 tab 页)的`渲染线程`和`JS线程`互斥，脚本运行会阻碍`视图`渲染，反之同理，故而当遇到一些复杂耗时的计算的时候，页面渲染出现卡顿。`Web Workers API`就是用来解决这个问题的，新开辟的`worker线程`与`父线程`使用`onmessage`和`postMessage`函数双工通信，不会影响其它线程运行。

> 详细的介绍可以查看[Web Workers Api in MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)

#### 简单 worker, 加法运算

**主线程：**

```js
// 初始化
const worker = new Worker('js/plus.js');
// 监听消息
worker.onmessage = function(self, ev) {
  console.log('Plus Worker Result: ', ev.data);
};
// 发送消息
worker.postMessage([1, 2]);
```

**plus.js：**

```js
// 监听消息
onmessage = function(ev) {
  // 获取数据
  const [arg1, arg2] = ev.data;
  //  发送消息
  postMessage(arg1 + arg2);
};
```

## 实现博客搜索

#### 需求分析

笔者的博客右上角有一个搜索的功能，可以去搜索一下看看效果。虽然文章数量不多，就算放在主线程里直接计算应该也不会影响 UI 渲染，但本着活学活用的原则，学习过`Worker`很久了也没遇到用上的机会，故而就用`Worker`来实现博客文章搜索算法尝尝鲜。

设置 input 框每输入一个字符都执行一次搜索并展示搜索结果，每输入一个字符延迟 200 毫秒执行搜索，以防频繁输入 (防抖) ，然后如果上一次搜索结果未返回，则忽略上次的搜索结果，重置 worker 释放资源后再执行本次搜索，以防`keyword`与搜索结果不符。

搜索返回的结果中，与`keyword`相关的字符使用`<span class="keyword-highlight"></span>`包裹以高亮显示，然后使用 React 的`dangerouslySetInnerHTML`渲染。

> 输入法状态输入时不搜索，实现方案详见[input 输入框如何在输入法状态时不触发操作](#/article/input输入框如何在输入法状态时不触发操作)

#### 搜索算法规则

根据输入的关键字`keyword`给出三类搜索结果，分别为`标签`、`分组`、`文章`，每类结果仅当有搜索结果时才展示。

- `标签`：根据`keyword`与`标签名`对比计算权重，完全匹配权重为`4`，包含`keyword`权重为`2`，只包含`keyword`中部分字符权重为`1`。匹配结果根据`权重倒序`和`标签名字母表`顺序排序。
- `分组`：同上`标签`，区别是`keyword`和`分组名`作比对。
- `文章`：根据`keyword`与`文章标题`、`文章内容`作匹配，比对规则同`标签`，然后根据`累计权重倒序`和`文章标题的字母表`顺序排列。

#### 定义主线程和搜索 Worker 互通的数据类型

主线程 postMessage data 类型：

```typescript
interface DocInfo {
  // 标签列表
  tags: { name: string }[];
  // 分组列表
  group: { name: string }[];
  // 文章列表
  articles: { title: string; content: string }[];
}

interface MainData {
  // 搜索的关键字
  keyword: string;
  docInfo: DocInfo;
}
```

搜索 Worker postMessage data 类型：

```typescript
interface SearchResult {
  tags: {
    // 标签名称
    name: string;
    // 带有高亮keyword的标签名
    match: string;
  }[];
  groups: {
    // 组名
    name: string;
    // 带有高亮keyword的组名
    match: string;
  }[];
  articles: {
    // 文章id
    id: number;
    // 带有高亮keyword的文章title
    title: string;
    // 带有高亮keyword的文章content
    match: string;
  }[];
}
```

这样设计搜索 Worker 返回的数据结构为的是方便进行遍历渲染，而无需做额外的格式转换。

#### 主线程 Search 函数

因为执行每一次搜索之前，会忽略上次的结果，并重置 worker，所以使用单例模式，维护一个 worker 实例，并记录一个 worker 的状态。执行搜索时，根据当前 worker 状态，决定是否执行重置操作，然后再监听结果，发送消息

##### getWorker 函数

```typescript
// 自执行函数闭包管理worker及workerStatus变量
const getWorker = (function() {
  // 搜索脚本的路径
  const scriptUrl = 'js/searchWorker.js';
  // worker实例
  let worker: Worker | undefined;
  // worker状态： 1为空闲，0为繁忙或不可用
  let workerStatus: 0 | 1 = 0;
  // 上次任务的reject
  let latestReject: ((reason?: any) => any) | undefined;

  return () => {
    // 未初始化或繁忙，则重置worker
    if (!worker || !workerStatus) {
      // 上次任务reject
      latestReject && latestReject('有新的搜索任务');
      // 销毁线程
      worker && worker.terminate();
      // 初始化worker
      worker = new Worker(scriptUrl);
      // 初始化状态
      workerStatus = 1;
    }
    return {
      worker,
      status: workerStatus,
      setStatus(status: 0 | 1) {
        workerStatus = status;
      },
      setReject(reject: (reason?: any) => any) {
        latestReject = reject;
      }
    };
  };
})();
```

##### Search 函数

```typescript
interface DocInfo {
  // ...
}
interface SearchResult {
  // ....
}
function getWorker() {
  // ...
}
function Search(keyword: string, docInfo: DocInfo) {
  return new Promise<SearchResult>((resolve, reject) => {
    // 获取worker
    const { worker, setStatus, setReject } = getWorker();
    // 设置worker状态为繁忙
    setStatus(0);
    // 5s秒后超时
    let timeout = setTimeout(() => {
      reject('timeout');
      // 释放资源
      worker && worker.terminate();
    }, 5000);
    // 监听消息
    worker.onmessage = function(this: Worker, ev: MessageEvent) {
      // 清除超时设置
      clearTimeout(timeout);
      // 设置worker状态为空闲
      setStatus(1);
      // 返回搜索结果
      resolve(ev.data);
    };
    // 记录reject
    setReject(reject);
    // 发送消息
    worker.postMessage({ keyword, docInfo });
  });
}
```

##### 防抖调用 Search 函数

```jsx harmony
import React, { useState, useEffect, useRef } from 'react';

function Search(keyword, docInfo) {
  // ...
  // return Promise.resolve()
}
const docInfo = {};

const SearchComp = () => {
  const [keyword, setKeyword] = useState('');
  const timeoutRef = useRef();
  // keyword变化时，防抖200毫秒执行搜索
  useEffect(() => {
    if (!keyword) {
      // 处理keyword为空的情况
      return;
    }
    // 清除上次的延迟执行
    clearTimeout(timeoutRef.current);
    // 启动本次延迟执行
    timeoutRef.current = setTimeout(() => {
      // 调用Search执行搜索
      Search(keyword, docInfo).then(res => {
        // 处理搜索结果
      });
    }, 200);
    // useEffect副作用清除
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [keyword]);
  return (
    <input
      type="text"
      value={keyword}
      onChange={ev => {
        setKeyword(ev.target.value);
      }}
    />
  );
};
```

#### Search Worker 实现

如上的权重计算准则分为三种情况：

- 完全匹配
- 包含 keyword
- 只包含 keyword 中部分(指 keyword 中以空格分开的单词)

##### `完全匹配`

直接使用全等比较，替换 keyword 直接使用<span>全部包裹起来就行

```js
function executeFullMatch(keyword, str) {
  if (keyword === str) {
    // 匹配成功，权重+4
    return `<span class="keyword-highlight">${str}</span>`;
  } else {
    // 匹配成功，权重+0
    return false;
  }
}
```

##### `包含keyword`

使用`String`原型中的`includes`函数判断，替换 keyword 使用`String`的`replace`函数传入字符串递归替换，直到找不到 keyword 为止(因为`replace`函数在第一个参数传入字符串时，仅仅只会替换第一个匹配的字符串)，也可将`keyword`转换为`全局匹配`的`正则表达式`，然后用`replace`替换。而将一个字符串转换为正则表达式的实现大概如下：

```js
function string2regstr(str) {
  // 将正则中的关键字符都使用\转义即可，将所有字符当成字符本身处理，而不是匹配字符(这里使用\\是因为\字符本身就需要被转义，故而\\代表\)，
  return str.replace(/([.\\\[\]^$()?:*+|{},=!])/gi, '\\$1');
}

function executeIncludeMatch(keyword, str) {
  if (str.includes(keyword)) {
    // 匹配成功，权重+2
    const keywordReg = new RegExp(string2regstr(keyword), 'gi');
    return str.replace(keywordReg, matchStr => {
      return `<span class="keyword-highlight">${matchStr}</span>`;
    });
  } else {
    // 匹配成功，权重+0
    return false;
  }
}
```

##### `包含部分keyword`

将 keyword 以空格分离成几个词组，然后将之转换为正则表达式进行匹配，替换 keyword 则以全局模式将这些词组都替换成<span>包裹的字符。

```js
function string2regstr(str) {
  // 将正则中的关键字符都使用\转义即可，将所有字符当成字符本身处理，而不是匹配字符(这里使用\\是因为\字符本身就需要被转义，故而\\代表\)，
  return str.replace(/([.\\\[\]^$()?:*+|{},=!])/gi, '\\$1');
}
function executePartMatch(keyword, str) {
  const keywordArr = string2regstr(keyword).split(/\s+/);
  // 分组匹配，比如keywordArr: ['I', 'am', 'Liu']，转换成 /(I|am|Liu)/gi
  const keywordReg = new RegExp(`(${keywordArr.join('|')})`, 'gi');
  if (str.match(keywordReg)) {
    // 匹配成功，权重+1
    return str.replace(keywordReg, matchStr => {
      return `<span class="keyword-highlight">${matchStr}</span>`;
    });
  } else {
    // 匹配成功，权重+0
    return false;
  }
}
```

##### 综合

根据上面的三种匹配方法，然后去分别对`标签`、`分组`、`文章`与`keyword`进行匹配，然后根据权重和字母表排序，组合成定义好的结果对象格式。效果请看右上角的搜索框！

## 总结

`Web Workers API`可以帮助我们解决复杂脚本计算影响视图渲染的问题，实现方式是另辟线程执行计算内容，通过`onmessage`和`postMessage`函数交互消息。

> 当然也有一些其它不太常用的 Worker，有兴趣的朋友可以去了解一下。 [worker 中数据的接收与发送](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
