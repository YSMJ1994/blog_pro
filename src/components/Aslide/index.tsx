import React, { CSSProperties, FC, useMemo } from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
import InfoCard from '@/components/InfoCard';
import BlogInfoCard from '@/components/BlogInfoCard';
import WithAnimateShow from '@/hoc/WithAnimateShow';

interface AsideProps {
	className?: string;
	style: CSSProperties;
}

const Children = [InfoCard, BlogInfoCard].map(C => WithAnimateShow(C));

const Aside: FC<AsideProps> = ({ className, style }) => {
	return (
		<aside className={cs(styles.aside, className)} style={style}>
			{Children.map((C, i) => (
				<C key={i} direction={i === 0 ? 'unset' : 'down'} delay={1000 + 500 * i} />
			))}
		</aside>
	);
};

export default Aside;
