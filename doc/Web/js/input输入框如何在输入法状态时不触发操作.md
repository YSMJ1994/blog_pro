---tag: input,javascript,js,isComposing
---start

介绍如何设置 input 在输入法状态时不触发操作。

---end

## 直接来个 基于 React16.8.6 hooks 的组件

```jsx harmony
// NoCompositionInput.jsx
import React, { useState, useEffect, forwardRef } from 'react';

const NoCompositionInput = ({ value, onChange, ...otherProps }, ref) => {
  const [inputValue, setInputValue] = useState(value);

  // 当value变化时保持inputValue与value一致
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <input
      ref={ref}
      {...otherProps}
      value={inputValue}
      onCompositionEnd={() => {
        // 当输入法键入结束时，onChange事件的isComposing仍为true，所以需要在这里提交键入的inputValue值
        onChange && onChange(inputValue);
      }}
      onChange={e => {
        // 判断是否是输入法状态
        const isComposing = e.nativeEvent.isComposing;
        // 获取value
        const value = e.target.value;
        if (isComposing) {
          // 输入法状态只改变内部状态
          setInputValue(value);
        } else {
          // 否则触发onChange事件
          onChange && onChange(value);
        }
      }}
    />
  );
};
// 传递ref
const Input = forwardRef(NoCompositionInput);
export default Input;
```

## How to use?

当成一个普通 input 来使用就行了，区别是，onChange 的参数是 input 框的值，且在输入法状态下不会触发 onChange。

like this:

```jsx harmony
import React, { useState, useRef } from 'react';
import Input from 'components/NoCompositionInput.jsx';

const Demo = () => {
  const [value, setValue] = useState('');
  // 照常使用ref.current获取input的dom元素
  const ref = useRef();
  return (
    <Input
      ref={ref}
      value={value}
      onChange={v => {
        // 输入法状态输入完成时才会执行
        setValue(v);
      }}
    />
  );
};
```
