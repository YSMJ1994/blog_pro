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
  const [isComposition, setIsComposition] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    !isComposition && onChange && onChange(inputValue);
  }, [isComposition, inputValue]);

  return (
    <input
      ref={ref}
      {...otherProps}
      value={inputValue}
      onCompositionStart={() => setIsComposition(true)}
      onCompositionUpdate={() => setIsComposition(true)}
      onCompositionEnd={() => setIsComposition(false)}
      onChange={e => {
        setInputValue(e.target.value);
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
