[tag]: #(es6,Generator,Itereator)
[preview]: #(start)

关于 es6`Generator`函数的理解

[preview]: #(end)

## Generator 函数是啥

简要来说，`Generator`函数是一个可以返回`生成器对象`的函数。`Generator`函数的作用是定义一种迭代方式，这种迭代方式符合[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)。

> `生成器对象`即为符合[可迭代协议和迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)的对象

```typescript
type Generator = () => {
    next: () => {
        value: any;
        done: boolean;
    };
};
```

## 定义一个 Generator 函数

不同于普通函数，`Generator`函数的定义方式只能由`function`关键字定义，并且需要在`function`关键字后面添加一个`*`号。而其内部的`yield`关键字则描述了该`Generator`函数返回的`生成器对象`每次调用`next()`时返回的`value`值。

> `yield`关键字只能在 Generator 函数内部使用

例如：

```typescript
// Generator函数
function* myIterator() {
    yield 1;
    yield 2;
    yield 3;
}
// 生成器对象
const it = myIterator();
// 调用一次next()
it.next(); // { value: 1, done: false }
// 调用两次next()
it.next(); // { value: 2, done: false }
// 调用三次next()
it.next(); // { value: 2, done: false }
// 调用四次及以上next()
it.next(); // { value: undefined, done: true }
```

## 使用 Generator 定义了对象的迭代方式之后，如何使用

ES6 的`for of`语法可以对实现了`可迭代协议`的对象遍历。一些内置实现`可迭代协议`的对象有`String`、`Array`、`TypedArray`、`Map`、`Set`

例如对数组的`for of`遍历：

```typescript
const array = ['李白', '王维', '杜甫'];
for (const item of array) {
    console.log(item);
}
/* console:
    '李白'
    '王维'
    '杜甫'
*/
```

#### 对比`for in`

`for in`遍历返回的是对象可枚举的 key，`for in`可以对任意对象使用;而`for of`遍历返回的是对象迭代器内定义的值，数组的迭代器返回的是数组里面的元素，`for of`只能对符合`可迭代协议`的对象使用。

## 定义一个自定义可迭代对象

要创建一个拥有自定义迭代方式的对象，则这个对象要符合[可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)，即拥有一个为`Symbol.iterator`的 key，其值为我们自定义的一个描述这个对象的迭代方式的`Generator`函数。

例如：

```typescript
// 目标对象
const user = {
    id: 1,
    name: '王维',
    sex: '男'
};

// 定义该对象的迭代器
// 迭代方式为：按照key的字母表顺序依次迭代该key的值
function* Iterator() {
    const keys = Object.keys(user).sort((a, b) => (a > b ? 1 : -1));
    for (let i = 0, len = keys.length; i < len; i++) {
        yield user[keys[i]];
    }
}

// 使对象符合可迭代协议
Object.defineProperty(user, Symbol.iterator, {
    configurable: true,
    enumerable: false,
    value: Iterator
});

// for of测试
for (const value of user) {
    console.log(value);
}
/*console:
    1
    '王维'
    '男'
*/
// 调用迭代器测试
const it = user[Symbol.iterator]();
it.next(); // { value: 1, done: false }
it.next(); // { value: '王维', done: false }
it.next(); // { value: '男', done: false }
it.next(); // { value: undefined, done: true }
```

## 其他用法及 api

此外，`Generator`函数返回的`生成器对象`的`next`函数还可以向上一次的`yield`传值

例如:

```typescript
function* Iterator() {
    let a = 0;
    let b = yield a + 2;
    yield b * 2;
}
const it = Iterator();
// 第一次执行，yield返回 a + 2 = 2
const value1 = it.next(); // { value: 2, done: false }
// 第二次执行，本次next传入的值为undefined,则b = undefined,返回undefined * 2 = NaN
const value2 = it.next(); // { value: NaN, done: false }
// 第三次执行，运行结束，返回Iterator的返回值为undefined
const value3 = it.next(); // { value: undefined, done: true }

const it2 = Iterator();
// 第一次执行，yield返回 a + 2 = 2
const value21 = it2.next(); // { value: 2, done: false }
// 第二次执行，本次next传入上次yield返回的2，则b = 2,返回2 * 2 = 4
const value22 = it2.next(value21.value); // { value: 4, done: false }
// 第三次执行，运行结束，返回Iterator的返回值为undefined
const value23 = it2.next(); // { value: undefined, done: true }
```

暂时没发现有什么用，其它用法详见[Generator in MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)
