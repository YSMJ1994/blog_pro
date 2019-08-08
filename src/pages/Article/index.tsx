import React, { FC, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import styles from './style.module.scss';
import DocCtx from '@/ctx/DocCtx';
import DocCard from '@/components/DocCard';
import SIcon from '@/components/SIcon';

const Article: FC<{ className?: string } & RouteComponentProps<{ id: string }>> = ({
	className,
	match: {
		params: { id }
	},
	history
}) => {
	const intId = +id;
	const { articles } = useContext(DocCtx);
	let index: number = 0;
	console.log('articles', articles, id);
	const article = articles.filter((a, i) => {
		if (a.id === intId) {
			index = i;
			return true;
		} else {
			return false;
		}
	})[0];
	if (isNaN(intId) || !articles) {
		return (
			<div>
				<h1>参数错误</h1>
			</div>
		);
	}
	const size = articles.length;
	const previousIndex = index - 1;
	const previousArticle = size > 1 ? articles[previousIndex < 0 ? size - 1 : previousIndex] : null;
	const previousTitle = previousArticle ? previousArticle.title : '无';
	const nextIndex = index + 1;
	const nextArticle = size > 1 ? articles[nextIndex >= size ? 0 : nextIndex] : null;
	const nextTitle = nextArticle ? nextArticle.title : '无';
	return (
		<div className={cs(styles.article, className)}>
			<DocCard doc={article} />
			<div className={styles.footerNavigator}>
				<div
					onClick={() => previousArticle && history.push(`/article/${previousArticle.id}`)}
					className={cs(styles.navigator, styles.previous, { [styles.navigatorDisabled]: !previousArticle })}
				>
					<SIcon className={styles.navigatorIcon} name="arrow-right-line" />
					<div className={styles.navigatorBody}>
						<div className={styles.hint}>Previous</div>
						<div className={styles.title}>{previousTitle}</div>
					</div>
				</div>
				<div
					onClick={() => nextArticle && history.push(`/article/${nextArticle.id}`)}
					className={cs(styles.navigator, styles.next, { [styles.navigatorDisabled]: !previousArticle })}
				>
					<div className={styles.navigatorBody}>
						<div className={styles.hint}>Next</div>
						<div className={styles.title}>{nextTitle}</div>
					</div>
					<SIcon className={styles.navigatorIcon} name="arrow-right-line" />
				</div>
			</div>
		</div>
	);
};

export default Article;
