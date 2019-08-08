import React, { FC, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import DocCtx from '@/ctx/DocCtx';
import styles from './style.module.scss';
import Title from '@/components/Link';
import DocCard from '@/components/DocCard';
import PageTitle from '@/components/PageTitle';
import usePagination from '@/hooks/usePagination';

const TagDetail: FC<RouteComponentProps<{ name: string }>> = ({ match: { params } }) => {
	const { name } = params;
	const docInfo = useContext(DocCtx);
	const { tagMap } = docInfo;
	const { size, articles } = tagMap[name];
	const [list, page, Pagination] = usePagination(articles, 5);
	return (
		<div className={styles.tagDetail}>
			<PageTitle
				title={
					<span className={styles.title}>
						标签 <span className={styles.tagName}>{name}</span>{' '}
						<span className={styles.tagDesc}> 总计{size}篇文章</span>
					</span>
				}
			/>
			<ul className={styles.tagList}>
				{list.map(doc => {
					return (
						<li key={doc.title} className={styles.tagItem}>
							<DocCard doc={doc} mini />
						</li>
					);
				})}
			</ul>
			<Pagination />
		</div>
	);
};

export default TagDetail;
