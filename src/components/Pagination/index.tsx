import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import styles from './style.module.scss';
import SIcon from '@/components/SIcon';
import cs from 'classnames';

interface PaginationProps {
	className?: string;
	style?: CSSProperties;
	current: number;
	pageSize: number;
	total: number;
	onChange?: (current: number, pageSize?: number) => void;
}
const Index: React.FC<PaginationProps> = ({ className, style, current, pageSize, total, onChange }) => {
	const [prefixPages, setPrefixPages] = useState<number[]>([]);
	const [middlePages, setMiddlePages] = useState<number[]>([]);
	const [suffixPages, setSuffixPages] = useState<number[]>([]);
	const [leftArrowShow, setLeftArrowShow] = useState(false);
	const [rightArrowShow, setRightArrowShow] = useState(false);
	const [maxPage, setMaxPage] = useState(1);
	useEffect(() => {
		const totalPage = Math.ceil(total / pageSize) || 1;
		setMaxPage(totalPage);
		let list = [];
		for (let i = 1; i <= totalPage; i++) {
			list.push(i);
		}
		if (list.length <= 6) {
			setPrefixPages(list);
			setMiddlePages([]);
			setSuffixPages([]);
			setLeftArrowShow(false);
			setRightArrowShow(false);
		} else {
			if (current <= 3) {
				setPrefixPages(list.slice(0, 5));
				setMiddlePages([]);
				setSuffixPages(list.slice(-1));
				setLeftArrowShow(false);
				setRightArrowShow(true);
			} else if (current >= list.length - 3) {
				setPrefixPages(list.slice(0, 1));
				setMiddlePages([]);
				setSuffixPages(list.slice(-5));
				setLeftArrowShow(true);
				setRightArrowShow(false);
			} else {
				setPrefixPages(list.slice(0, 1));
				setMiddlePages(list.slice(current - 3, current + 2));
				setSuffixPages(list.slice(-1));
				setLeftArrowShow(true);
				setRightArrowShow(true);
			}
		}
	}, [current, pageSize, total]);
	const resolveClick = useCallback(
		(page: number) => {
			if (current !== page) {
				onChange && onChange(page, pageSize);
			}
		},
		[current]
	);
	return (
		<div className={cs(styles.pagination, className)} style={style}>
			{prefixPages.map(page => {
				return (
					<div
						key={page}
						className={cs(styles.paginationItem, { [styles.current]: page === current })}
						onClick={() => resolveClick(page)}
					>
						{page}
					</div>
				);
			})}
			{leftArrowShow && (
				<div className={styles.paginationEscapeBox} onClick={() => resolveClick(Math.max(1, current - 2))}>
					<SIcon name="duble-arrow-down" className={cs(styles.paginationArrow, styles.left)} />
					<span className={styles.paginationEscape}>•••</span>
				</div>
			)}
			{middlePages.map(page => {
				return (
					<div
						key={page}
						className={cs(styles.paginationItem, { [styles.current]: page === current })}
						onClick={() => resolveClick(page)}
					>
						{page}
					</div>
				);
			})}
			{rightArrowShow && (
				<div
					className={styles.paginationEscapeBox}
					onClick={() => resolveClick(Math.min(maxPage, current + 2))}
				>
					<SIcon name="duble-arrow-down" className={cs(styles.paginationArrow, styles.right)} />
					<span className={styles.paginationEscape}>•••</span>
				</div>
			)}
			{suffixPages.map(page => {
				return (
					<div
						key={page}
						className={cs(styles.paginationItem, { [styles.current]: page === current })}
						onClick={() => resolveClick(page)}
					>
						{page}
					</div>
				);
			})}
		</div>
	);
};

export default Index;
