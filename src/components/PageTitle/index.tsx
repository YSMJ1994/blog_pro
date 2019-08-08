import React, { FC } from 'react';
import styles from './style.module.scss';
import cs from 'classnames';

const PageTitle: FC<{ className?: string; title: string | React.ReactElement; sub?: string | React.ReactElement }> = ({
	className,
	title,
	sub
}) => {
	return (
		<div className={cs(styles.pageTitle, className)}>
			<span>{title}</span>
			<span className={styles.sub}>{sub}</span>
		</div>
	);
};

export default PageTitle;
