import React, { FC, PropsWithChildren, useContext, useState, MouseEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import styles from './style.module.scss';
import DocCtx, { Group, MdDoc } from '@/ctx/DocCtx';
import SIcon from '@/components/SIcon';
import PageTitle from '@/components/PageTitle';

const Row: FC<{ label: string; icon?: string }> = ({ label, icon }) => {
	return (
		<span className={styles.row}>
			<span className={styles.rowIcon}>{!!icon && <SIcon name={icon} />}</span>
			<span className={styles.rowLabel}>{label}</span>
		</span>
	);
};

const TreeRow: FC<
	PropsWithChildren<{ open?: boolean; isLeaf?: boolean; onClick?: (e: MouseEvent<HTMLDivElement>) => void }>
> = ({ open = false, isLeaf = false, onClick, children }) => {
	return (
		<div className={styles.treeRow} onClick={onClick}>
			<span className={styles.treeRowIcon}>
				{!isLeaf && (
					<SIcon
						name="arrow-down-little"
						className={cs(styles.treeRowIconArrow, { [styles.treeRowIconOpen]: open })}
					/>
				)}
			</span>
			<span className={styles.treeRowContent}>{children}</span>
		</div>
	);
};

const ArticleItem: FC<MdDoc & { onClick?: (e: MouseEvent<HTMLDivElement>) => void }> = ({ title, onClick }) => {
	return (
		<div className={styles.articleItem} onClick={onClick}>
			<TreeRow isLeaf>
				<Row label={title} icon="article-line" />
			</TreeRow>
		</div>
	);
};

const GroupItem: FC<Group & { open?: boolean; goArticle?: (title: string) => void }> = ({
	name,
	articles = [],
	groups = [],
	open = false,
	goArticle
}) => {
	const [itemOpen, setItemOpen] = useState(open);
	const hasChildrenGroups = Boolean(groups.length);
	const hasArticles = Boolean(articles.length);
	return (
		<div className={styles.groupItem}>
			<TreeRow open={itemOpen} onClick={() => setItemOpen(!itemOpen)}>
				<Row label={name} icon={itemOpen ? 'dir-open' : 'dir-close'} />
			</TreeRow>
			<ul className={cs(styles.groupItemChildren, { [styles.groupItemChildrenOpen]: itemOpen })}>
				{hasChildrenGroups &&
					groups.map(childGroup => {
						return (
							<li key={childGroup.name}>
								<GroupItem {...childGroup} open={open} goArticle={goArticle} />
							</li>
						);
					})}
				{hasArticles &&
					articles.map(article => {
						return (
							<li key={article.title}>
								<ArticleItem {...article} onClick={() => goArticle && goArticle(article.title)} />
							</li>
						);
					})}
			</ul>
		</div>
	);
};

const GroupPage: FC<{ className?: string } & RouteComponentProps<any>> = ({ className, history }) => {
	const { group: groups } = useContext(DocCtx);
	const goArticle = (title: string) => {
		history.push(`/article/${title}`);
	};
	return (
		<div className={cs(styles.groupWrap, className)}>
			<PageTitle title="分类" sub={`共计${groups.length}个分类`} />
			{groups.map(group => {
				return <GroupItem key={group.name} {...group} goArticle={goArticle} />;
			})}
		</div>
	);
};

export default GroupPage;
