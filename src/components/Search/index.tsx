import React, { useRef, useState, useEffect, useContext, FC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import styles from './index.module.scss';
import SIcon from '@/components/SIcon';
import SearchWorker, { SearchArticle, SearchGroup, SearchResult, SearchTag } from '@/utils/SearchWorker';
import DocCtx from '@/ctx/DocCtx';
import StateCtx from '@/ctx/StateCtx';
import { isMobile } from '@/utils';
import Input from '@/components/NoCompositionInput';
import useClickOutside from '@/hooks/useClickOutside';
import useFocus from '@/hooks/useFocus';

const SearchItemBox: FC<{ title: string }> = ({ title, children }) => {
	return (
		<>
			<tr className={styles.searchItemTitle}>
				<td colSpan={2}>{title}</td>
			</tr>
			{children}
		</>
	);
};

const TagItem: FC<{ tag: SearchTag; onClick?: ClickHandler<HTMLTableRowElement> }> = ({ tag, onClick }) => {
	return (
		<tr onClick={onClick}>
			<td className={styles.itemLabel}>tag</td>
			<td dangerouslySetInnerHTML={{ __html: tag.match }} />
		</tr>
	);
};

const GroupItem: FC<{ group: SearchGroup; onClick?: ClickHandler<HTMLTableRowElement> }> = ({ group, onClick }) => {
	return (
		<tr onClick={onClick}>
			<td className={styles.itemLabel}>group</td>
			<td dangerouslySetInnerHTML={{ __html: group.match }} />
		</tr>
	);
};

const ArticleItem: FC<{ article: SearchArticle; onClick?: ClickHandler<HTMLTableRowElement> }> = ({
	article,
	onClick
}) => {
	return (
		<tr onClick={onClick}>
			<td className={styles.itemLabel} dangerouslySetInnerHTML={{ __html: article.title }} />
			<td dangerouslySetInnerHTML={{ __html: article.match }} />
		</tr>
	);
};

const SearchPane: FC<{ keyword: string; show: boolean; onSearch: (pathname: string) => any }> = ({
	keyword,
	show = false,
	onSearch
}) => {
	const [result, setResult] = useState<SearchResult>({
		tags: [],
		groups: [],
		articles: []
	});
	const docInfo = useContext(DocCtx);
	const timeoutRef = useRef<NodeJS.Timeout>();
	useEffect(() => {
		// 没有关键字或input没有聚焦则不搜索
		if (!keyword) {
			setResult({
				tags: [],
				groups: [],
				articles: []
			});
			return;
		}
		// searching
		timeoutRef.current && clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			SearchWorker(keyword, docInfo)
				.then(result => {
					console.log('result', result);
					setResult(result);
				})
				.catch(error => {
					console.log('error', error);
				});
		}, 200);
		return () => timeoutRef.current && clearTimeout(timeoutRef.current);
	}, [keyword]);
	const { tags, groups, articles } = result;
	const hasResult = tags.length || groups.length || articles.length;
	return (
		<div className={cs(styles.searchPane, { [styles.searchPaneShow]: show })}>
			{hasResult ? (
				<table>
					<tbody>
						{!!tags.length && (
							<SearchItemBox title="标签">
								{tags.map(tag => {
									return (
										<TagItem
											key={tag.name}
											tag={tag}
											onClick={() => onSearch(`/tags/${tag.name}`)}
										/>
									);
								})}
							</SearchItemBox>
						)}
						{!!groups.length && (
							<SearchItemBox title="分组">
								{groups.map(group => {
									return (
										<GroupItem
											key={group.name}
											group={group}
											onClick={() => onSearch(`/group/${group.name}`)}
										/>
									);
								})}
							</SearchItemBox>
						)}
						{!!articles.length && (
							<SearchItemBox title="文章">
								{articles.map(article => {
									return (
										<ArticleItem
											key={article.id}
											article={article}
											onClick={() => onSearch(`/article/${article.id}`)}
										/>
									);
								})}
							</SearchItemBox>
						)}
					</tbody>
				</table>
			) : (
				<span className={styles.searchPaneBlank}>暂无相关文章</span>
			)}
		</div>
	);
};

export default withRouter<RouteComponentProps>(function Search({ history }) {
	const { searchFocus: focus, searchPaneShow: show, scrollElement, setState } = useContext(StateCtx);
	const [scrollTop, setScrollTop] = useState<number>(0);
	const setFocus = (focus: boolean) => {
		setState({
			searchFocus: focus
		});
	};
	const setShow = (show: boolean) => {
		// 移动端滚动穿透处理
		if (isMobile()) {
			if (show) {
				// 记录当前滚动视窗滚动高度，
				setScrollTop(scrollElement.scrollTop);
			} else {
				// 复原
				scrollElement.scrollTop = scrollTop;
			}
		}
		setState({
			searchPaneShow: show
		});
	};

	const [keyword, setKeyword] = useState('');

	const inputRef = useFocus<HTMLInputElement>(
		() => {
			setFocus(true);
		},
		() => {
			setFocus(false);
		}
	);

	useEffect(() => {
		keyword && focus && setShow(true);
	}, [focus, keyword]);

	const paneRef = useClickOutside<HTMLDivElement>(() => {
		setShow(false);
	});

	const onSearch = (pathname: string) => {
		if (pathname) {
			history.push(pathname);
			setFocus(false);
			setShow(false);
		}
	};
	return (
		<div ref={paneRef} className={cs(styles.search, { [styles.searchFocus]: focus || show })}>
			<Input
				ref={inputRef}
				className={styles.searchInput}
				value={keyword}
				onChange={value => {
					setKeyword(String(value));
				}}
			/>
			<SIcon name="search" className={styles.searchIcon} />
			<a
				className={styles.cancelText}
				onClick={() => {
					setFocus(false);
					setShow(false);
				}}
			>
				取消
			</a>
			<SearchPane show={show} keyword={keyword} onSearch={onSearch} />
		</div>
	);
});
