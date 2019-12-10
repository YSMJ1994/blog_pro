import React, { FC, useContext, useState, useEffect, EventHandler, MouseEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import cs from 'classnames';
import PageTitle from '@/components/PageTitle';
import DocCtx, { MdDoc } from '@/ctx/DocCtx';
import Moment from 'moment';
import styles from './style.module.scss';

type TimelineItem = {
	year: number;
	months: MonthItem[];
};

type MonthItem = {
	month: number;
	articles: MdDoc[];
};

type YearItem = {
	year: number;
	months: Obj<MonthItem>;
};

type Timeline = TimelineItem[];

const ArticleItem: FC<{ article: MdDoc; onClick: EventHandler<MouseEvent<HTMLAnchorElement>> }> = ({
	article,
	onClick
}) => {
	const { createTime, title } = article;
	const time = Moment(createTime).format('MM.DD');
	return (
		<a className={styles.article} onClick={onClick}>
			<span className={styles.articleTime}>{time}</span>
			<span className={styles.articleTitle}>{title}</span>
		</a>
	);
};

const MonthBox: FC<{ month: number }> = ({ month, children }) => {
	const time = Moment([0, month]);
	const zh = time.format('MMMM');
	time.locale('en');
	const en = time.format('MMMM');
	return (
		<div className={styles.monthBox}>
			<div className={styles.monthTitle}>
				{zh} {en}
			</div>
			<div className={styles.monthContent}>{children}</div>
		</div>
	);
};

const YearBox: FC<{ year: number }> = ({ year, children }) => {
	return (
		<div className={styles.yearBox}>
			<div className={styles.yearTitle}>{year}</div>
			<div className={styles.yearContent}>{children}</div>
		</div>
	);
};

const Timeline: FC<RouteComponentProps & { className: string }> = ({ className, history }) => {
	const { articles } = useContext(DocCtx);
	const [timeline, setTimeline] = useState<Timeline>([]);
	useEffect(() => {
		const timelineObj: Obj<YearItem> = {};
		articles.forEach(doc => {
			const { createTime } = doc;
			const time = Moment(createTime);
			const year = time.year();
			const month = time.month();
			if (!timelineObj[year]) {
				timelineObj[year] = {
					year,
					months: {}
				};
			}
			const yearItem = timelineObj[year];
			const monthObj = yearItem.months;
			if (!monthObj[month]) {
				monthObj[month] = {
					month,
					articles: []
				};
			}
			const monthItem = monthObj[month];
			monthItem.articles.push(doc);
		});
		setTimeline(
			Object.keys(timelineObj)
				.map(yearKey => {
					const { year, months } = timelineObj[yearKey];
					return {
						year,
						months: Object.keys(months)
							.map(monthKey => {
								const { month, articles } = months[monthKey];
								return {
									month,
									articles: articles.sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
								};
							})
							.sort((a, b) => (a.month < b.month ? 1 : -1))
					};
				})
				.sort((a, b) => (a.year < b.year ? 1 : -1))
		);
	}, [articles]);
	console.log('timeline', timeline);
	return (
		<div className={cs(styles.timeline, className)}>
			<PageTitle title={`归档 ${articles.length}posts`} icon="timeline" />
			{timeline.map(({ year, months }) => {
				return (
					<YearBox year={year} key={year}>
						{months.map(({ month, articles }) => {
							return (
								<MonthBox month={month} key={month}>
									{articles.map(article => {
										return (
											<ArticleItem
												key={article.id}
												article={article}
												onClick={() => {
													history.push(`/article/${article.id}`);
												}}
											/>
										);
									})}
								</MonthBox>
							);
						})}
					</YearBox>
				);
			})}
		</div>
	);
};

export default Timeline;
