import React, { CSSProperties } from 'react';
import cs from 'classnames';

type propTypes = {
	name: string;
	className?: string;
	style?: CSSProperties;
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function SIcon({ name, className, style, onClick }: propTypes) {
	const iconClass = cs('iconfont', name && `icon-${name}`, className);
	return <i className={iconClass} style={style} onClick={onClick} />;
}
