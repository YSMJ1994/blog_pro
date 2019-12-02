import React, { FC, PropsWithChildren, EventHandler, MouseEvent, CSSProperties } from 'react';
import styles from './style.module.scss';
import cs from 'classnames';

type BtnProps = {
	disabled?: boolean;
	loading?: boolean;
	type?: 'text' | 'normal' | 'success' | 'warn' | 'error';
	fill?: boolean;
	className?: string;
	style?: CSSProperties;
	onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
};
const Btn: FC<PropsWithChildren<BtnProps>> = ({
	className,
	style,
	disabled = false,
	loading = false,
	fill = false,
	type = 'normal',
	children,
	onClick
}) => {
	console.log('children', children);
	return (
		<button
			className={cs(styles.btn, styles[`btn--${type}`], className, {
				[styles.btnDisabled]: disabled,
				[styles.btnLoading]: loading,
				[styles.btnFill]: fill
			})}
			style={style}
			onClick={e => !loading && !disabled && onClick && onClick(e)}
		>
			{children}
		</button>
	);
};

export default Btn;
