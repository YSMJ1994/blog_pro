import React, { ComponentClass, CSSProperties, FC, useState } from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
import useTimeout from '@/utils/useTimeout';

export interface AnimateShowWrapperProps {
	className?: string;
	style?: CSSProperties;
	direction?: 'up' | 'down' | 'left' | 'right';
	delay?: number;
	distance?: string | number;
}
const WithAnimateShow = <P extends { className?: string; style?: CSSProperties }>(
	WrappedComp: FC<P> | ComponentClass<P>
): FC<P & AnimateShowWrapperProps> => (props: P & AnimateShowWrapperProps) => {
	const { className, style, direction = 'down', delay = 0, distance = 2 } = props;
	let xOffset, yOffset;
	const calcDistance = typeof distance === 'number' ? `${distance}rem` : distance;
	switch (direction) {
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
	const initStyle = {
		opacity: 0,
		transform: `translate(${xOffset},${yOffset})`
	};
	const [calcStyle, setCalcStyle] = useState<CSSProperties>({
		...style,
		...initStyle
	});
	useTimeout(() => {
		setCalcStyle({
			...style,
			opacity: 1,
			transform: 'unset'
		});
	}, delay);
	return <WrappedComp {...props} className={cs(className, styles.animateShow)} style={calcStyle} />;
};

export default WithAnimateShow;
