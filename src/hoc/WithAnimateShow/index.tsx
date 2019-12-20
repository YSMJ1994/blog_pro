import React, { ComponentClass, CSSProperties, FC, useState, PropsWithChildren } from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
import { useTimeout } from '@ysmj/web_utils';

export interface AnimateShowWrapperProps {
	className?: string;
	style?: CSSProperties;
	direction?: 'up' | 'down' | 'left' | 'right' | 'unset';
	delay?: number;
	distance?: string | number;
}

interface WithAnimateShow {
	<P extends { style: CSSProperties }>(Comp: RC<P>): FC<Merge<P, AnimateShowWrapperProps>>;
}

const WithAnimateShow: WithAnimateShow = WrappedComp => props => {
	const { style, direction = 'down', delay = 0, distance = 2, ...otherProps } = props;
	let xOffset, yOffset;
	const calcDistance = typeof distance === 'number' ? `${distance}rem` : distance;
	switch (direction) {
		case 'unset': {
			return <WrappedComp {...otherProps as any} style={style} />;
		}
		case 'up': {
			xOffset = 0;
			yOffset = `-${calcDistance}`;
			break;
		}
		case 'down': {
			xOffset = 0;
			yOffset = `${calcDistance}`;
			break;
		}
		case 'left': {
			xOffset = `-${calcDistance}`;
			yOffset = 0;
			break;
		}
		case 'right': {
			xOffset = `${calcDistance}`;
			yOffset = 0;
			break;
		}
	}
	const initStyle: CSSProperties = {
		opacity: 0,
		transform: `translate(${xOffset},${yOffset})`,
		transition: 'opacity 1s ease-in-out, transform 1s ease-in-out'
	};
	const [calcStyle, setCalcStyle] = useState<CSSProperties>({
		...style,
		...initStyle
	});
	useTimeout(() => {
		setCalcStyle({
			...style,
			transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
			opacity: 1,
			transform: 'unset'
		});
	}, delay);
	useTimeout(() => {
		setCalcStyle({
			...style
		});
	}, delay + 1000);
	return <WrappedComp {...otherProps as any} style={calcStyle} />;
};

export default WithAnimateShow;
