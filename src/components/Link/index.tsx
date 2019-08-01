import React, { CSSProperties, MouseEventHandler } from 'react';
import styles from './style.module.scss';
import cs from 'classnames';

interface LinkProps {
	active?: boolean;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	className?: string;
	style?: CSSProperties;
	to?: string;
	title?: string;
}
const Index: React.FC<LinkProps> = ({
	active = false,
	children,
	to = 'javascript:',
	title = '',
	onClick,
	className,
	style
}) => {
	return (
		<a
			className={cs(styles.customLink, className, { [styles.active]: active })}
			style={style}
			href={to}
			title={title}
			onClick={onClick}
		>
			{children}
		</a>
	);
};

export default Index;
