import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './style.module.scss';
import { formatTime } from '@/utils';
import { MdDoc } from '@/ctx/DocCtx';
import Title from '@/components/Link';
import cs from 'classnames';

interface DocCardProps {
	doc: MdDoc;
	mini?: boolean;
	tagClick?: (tag: string) => void;
	groupClick?: (group: string) => void;
}
const DocCard: FC<DocCardProps & RouteComponentProps<any>> = ({ mini = false, doc, tagClick, groupClick, history }) => {
	const { tag: tags = [], group: groups = [], createTime, modifyTime, title = '', review = '', content = '' } = doc;
	const createTimeStr = formatTime(createTime);
	const modifyTimeStr = formatTime(modifyTime);
	return (
		<div className={cs(styles.docCard, { [styles.mini]: mini })}>
			<div className={styles.header}>
				<Title
					className={styles.headerLabel}
					hoverShowUnderline={mini}
					onClick={() => history.push(`/article/${doc.title}`)}
				>
					{title}
				</Title>
				<div className={styles.headerDesc}>
					<div className={styles.headerDescItem}>
						<span className={styles.headerDescLabel}>发表时间</span>
						<span className={styles.headerDescValue}>{createTimeStr}</span>
						<span className={styles.headerDescLabel}>修改时间</span>
						<span className={styles.headerDescValue}>{modifyTimeStr}</span>
					</div>
				</div>
			</div>
			<div className={styles.body} dangerouslySetInnerHTML={{ __html: mini ? review || content : content }} />
			<div className={styles.footer}>
				<div className={styles.divider} />
				<div className={styles.footerContent}>
					{!!tags.length && (
						<div className={styles.footerItem}>
							<span className={styles.footerItemLabel}>标签</span>
							<span className={styles.footerItemContent}>
								{tags.map(tag => {
									return (
										<button
											key={tag}
											className={styles.tag}
											onClick={() => tagClick && tagClick(tag)}
										>
											{tag}
										</button>
									);
								})}
							</span>
						</div>
					)}
					{!!groups.length && (
						<div className={styles.footerItem}>
							<span className={styles.footerItemLabel}>分类</span>
							<span className={styles.footerItemContent}>
								{groups.map(group => {
									return (
										<span
											key={group}
											className={styles.group}
											onClick={() => groupClick && groupClick(group)}
										>
											{group}
										</span>
									);
								})}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default withRouter<DocCardProps & RouteComponentProps<any>>(DocCard);
