import React, { CSSProperties, FC } from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
import InfoCard from '@/components/InfoCard';

interface AsideProps {
	className?: string;
	style: CSSProperties;
}
const Aside: FC<AsideProps> = ({ className, style }) => {
	return (
		<aside className={cs(styles.aside, className)} style={style}>
			<InfoCard />
		</aside>
	);
};

export default Aside;
