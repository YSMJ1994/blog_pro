import React, { FC, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import styles from './style.module.scss';
import DocCtx from '@/ctx/DocCtx';
import DocCard from '@/components/DocCard';

const Article: FC<{ className?: string } & RouteComponentProps<{ title: string }>> = ({
	className,
	match: {
		params: { title }
	}
}) => {
	const docInfo = useContext(DocCtx);
	const article = docInfo.articleMap[title];
	return (
		<div className={cs(styles.article, className)}>
			<DocCard doc={article} />
		</div>
	);
};

export default Article;
