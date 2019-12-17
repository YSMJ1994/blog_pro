import React, { RefForwardingComponent, InputHTMLAttributes, useState, useEffect, forwardRef } from 'react';

interface RequiredProps {
	value: number | string;
	onChange: (value: number | string) => any;
}

const NoCompositionInput: RefForwardingComponent<
	HTMLInputElement,
	Merge<InputHTMLAttributes<HTMLInputElement>, RequiredProps>
> = ({ value, onChange, ...otherProps }, ref) => {
	const [inputValue, setInputValue] = useState(value);
	const [isComposition, setIsComposition] = useState<boolean>(false);
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
				const value = e.target.value;
				setInputValue(value);
			}}
		/>
	);
};
const Input = forwardRef(NoCompositionInput);
export default Input;
