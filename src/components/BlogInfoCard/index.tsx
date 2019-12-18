import React, { useContext, FC, CSSProperties } from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
import SIcon from '../SIcon';
import BlogInfo from '@/ctx/BlogInfo';
import DocCtx from '@/ctx/DocCtx';

const BlogInfoCard: FC<{ style: CSSProperties }> = ({ style }) => {
	const { access_num, runtime } = useContext(BlogInfo);
	const { articles } = useContext(DocCtx);
	const runtimeDay = Math.floor(runtime / (1000 * 60 * 60 * 24));
	return (
		<div className={styles.blogInfoCard} style={style}>
			<div className={styles.title}>
				<SIcon name="tongji" className={styles.titleIcon} />
				<span>网站统计</span>
			</div>
			<div className={styles.row}>
				<span>文章数量</span>
				<span>{articles.length}</span>
			</div>
			<div className={styles.row}>
				<span>博客运行时间</span>
				<span>{runtimeDay} 天</span>
			</div>
			<div className={styles.row}>
				<span>博客访问总量</span>
				<span>{access_num}</span>
			</div>
		</div>
	);
};

export default BlogInfoCard;
