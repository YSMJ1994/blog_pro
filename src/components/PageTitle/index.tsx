import React, { FC } from 'react';
import styles from './style.module.scss';
import cs from 'classnames';
import SIcon from 'components/SIcon';

interface PageTitleProps {
	className?: string;
	title: string | React.ReactElement;
	icon?: string;
	sub?: string | React.ReactElement;
}

const PageTitle: FC<PageTitleProps> = ({ className, title, sub, icon }) => {
	return (
		<div className={cs(styles.pageTitle, className)}>
			<div className={styles.titleBox}>
				{!!icon && <SIcon className={styles.titleIcon} name={icon} />}
				<span className={styles.title}>{title}</span>
				<div className={styles.separator} />
			</div>
			{!!sub && <span className={styles.sub}>{sub}</span>}
		</div>
	);
};

export default PageTitle;
