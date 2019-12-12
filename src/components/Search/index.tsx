import React, { useRef, useState, useEffect, useContext, FC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import styles from './index.module.scss';
import SIcon from '@/components/SIcon';
import SearchWorker, { SearchArticle, SearchGroup, SearchResult, SearchTag } from '@/utils/SearchWorker';
import DocCtx, { Group, MdDoc, Tag } from '@/ctx/DocCtx';
import { History } from 'history';

function string2reg(str: string) {
	return new RegExp(
		`(${str
			.split('')
			.map(char => {
				return char.replace(/([.\\\[\]^$()?:*+|{},=!])/, '\\$1');
			})
			.join('|')})`,
		'g'
	);
}

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
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
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
		searchTimeout && clearTimeout(searchTimeout);
		const tag = setTimeout(() => {
			SearchWorker(keyword, docInfo)
				.then(result => {
					console.log('result', result);
					setResult(result);
				})
				.catch(error => {
					console.log('error', error);
				});
		}, 300);
		setSearchTimeout(tag);
		return () => clearTimeout(tag);
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
	const inputRef = useRef<HTMLInputElement>(null);
	const [focus, setFocus] = useState(false);
	const [show, setShow] = useState<boolean>(false);
	const [isComposition, setIsComposition] = useState<boolean>(false);
	const [keyword, setKeyword] = useState('');
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const inputDom = inputRef.current;
		if (inputDom) {
			const listenFocus = function() {
				window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
				setFocus(true);
			};
			const listenBlur = function() {
				setFocus(false);
			};
			inputDom.addEventListener('focus', listenFocus);
			inputDom.addEventListener('blur', listenBlur);
			return () => {
				inputDom.removeEventListener('focus', listenFocus);
				inputDom.removeEventListener('blur', listenBlur);
			};
		}
	}, [inputRef.current]);
	useEffect(() => {
		keyword && focus && setShow(true);
	}, [focus, keyword]);
	// outside click 处理
	useEffect(() => {
		if (show) {
			const clickListener = (e: MouseEvent) => {
				// 如果事件target等于或在pane内，则代表在pane内的点击，不做处理，否则隐藏pane
				const pane = ref.current,
					target = e.target as Node;
				if (!pane || !target) {
					return;
				}
				if (pane !== target && !pane.contains(target)) {
					setShow(false);
				}
			};
			document.body.addEventListener('click', clickListener);
			return () => document.body.removeEventListener('click', clickListener);
		}
	}, [show]);
	const onSearch = (pathname: string) => {
		if (pathname) {
			history.push(pathname);
			setFocus(false);
			setShow(false);
		}
	};
	return (
		<div ref={ref} className={cs(styles.search, { [styles.searchFocus]: focus || show })}>
			<input
				ref={inputRef}
				className={styles.searchInput}
				value={keyword}
				onCompositionStart={() => setIsComposition(true)}
				onCompositionUpdate={() => setIsComposition(true)}
				onCompositionEnd={() => setIsComposition(false)}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setKeyword(String(e.target.value));
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
			<SearchPane show={show} keyword={isComposition ? '' : keyword} onSearch={onSearch} />
		</div>
	);
});
