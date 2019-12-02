import React, { FC, useContext } from 'react';
import styles from './style.module.scss';
import DocCtx from '@/ctx/DocCtx';
import { RouteComponentProps } from 'react-router-dom';
import PageTitle from '@/components/PageTitle';

const Overview: FC<RouteComponentProps<any>> = ({ history, match }) => {
	const docInfo = useContext(DocCtx);
	const { tags } = docInfo;
	const count = tags.length;
	return (
		<div className={styles.tagOverview}>
			<PageTitle className={styles.title} title="标签" icon="tag" sub={`共计${count}个标签`} />
			<div className={styles.tagList}>
				{tags.map(tag => {
					const { name, size } = tag;
					return (
						<button
							key={name}
							className={styles.tagItem}
							onClick={() => {
								history.push(`${match.path}/${name}`);
							}}
						>
							{name} ( {size} )
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default Overview;
