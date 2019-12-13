import React, { FC, useState } from 'react';

export interface ScrollView {
	element: HTMLElement;
	setElement: (element: HTMLElement) => any;
}

const initState = {
	element: document.documentElement,
	setElement() {}
};

const ScrollCtx = React.createContext<ScrollView>(initState);

export const Provider: FC = ({ children }) => {
	const [scrollView, setScrollView] = useState<HTMLElement>(document.documentElement);
	return (
		<ScrollCtx.Provider value={{ element: scrollView, setElement: setScrollView }}>{children}</ScrollCtx.Provider>
	);
};

export default ScrollCtx;
