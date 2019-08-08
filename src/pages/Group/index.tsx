import React, { FC, PropsWithChildren, useContext, useState, useEffect, MouseEvent } from 'react';
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

const GroupItem: FC<
	Group & {
		open?: boolean;
		goArticle?: (id: number) => void;
		paramsName?: string;
		onChildOpen?: (name: string) => void;
	}
> = ({ name, articles = [], groups = [], open = false, goArticle, paramsName, onChildOpen }) => {
	// 若默认url参数name和当前分组名称相同或默认为展开则当前分组展开
	const [itemOpen, setItemOpen] = useState(name === paramsName || open);
	const hasChildrenGroups = Boolean(groups.length);
	const hasArticles = Boolean(articles.length);
	// 监听子分组open 事件，子分组展开则当前分组也展开
	const listenChildOpen = (name: string) => {
		if (!itemOpen) {
			setItemOpen(true);
		}
	};
	// 若当前分组展开则通知父组件
	useEffect(() => {
		if (itemOpen) {
			onChildOpen && onChildOpen(name);
		}
	}, [itemOpen]);
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
								<GroupItem
									{...childGroup}
									open={open}
									goArticle={goArticle}
									onChildOpen={listenChildOpen}
									paramsName={paramsName}
								/>
							</li>
						);
					})}
				{hasArticles &&
					articles.map(article => {
						return (
							<li key={article.title}>
								<ArticleItem {...article} onClick={() => goArticle && goArticle(article.id)} />
							</li>
						);
					})}
			</ul>
		</div>
	);
};

const GroupPage: FC<{ className?: string } & RouteComponentProps<{ name?: string }>> = ({
	className,
	history,
	match: {
		params: { name }
	}
}) => {
	const { group: groups } = useContext(DocCtx);
	const goArticle = (id: number) => {
		history.push(`/article/${id}`);
	};
	return (
		<div className={cs(styles.groupWrap, className)}>
			<PageTitle title="分类" sub={`共计${groups.length}个分类`} />
			{groups.map(group => {
				return <GroupItem key={group.name} {...group} goArticle={goArticle} paramsName={name} />;
			})}
		</div>
	);
};

export default GroupPage;
