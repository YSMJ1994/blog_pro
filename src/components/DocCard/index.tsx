import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './style.module.scss';
import { formatTime } from '@/utils';
import { MdDoc } from '@/ctx/DocCtx';
import Title from '@/components/Link';
import cs from 'classnames';
import { PropsWithChildren } from '~/node_modules/@types/react';

interface DocCardProps {
	doc: MdDoc;
	mini?: boolean;
}

type ResolveProps = PropsWithChildren<DocCardProps & RouteComponentProps<any>>;

const DocCard: FC<ResolveProps> = ({ mini = false, doc, history, children }) => {
	const { tag: tags = [], group: groups = [], createTime, modifyTime, title = '', review = '', content = '' } = doc;
	const createTimeStr = formatTime(createTime);
	const modifyTimeStr = formatTime(modifyTime);
	return (
		<div className={cs(styles.docCard, { [styles.mini]: mini })}>
			<div className={styles.header}>
				<Title
					className={styles.headerLabel}
					hoverShowUnderline={mini}
					onClick={() => history.push(`/article/${doc.id}`)}
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
											onClick={() => history.push(`/tags/${tag}`)}
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
											onClick={() => history.push(`/group/${group}`)}
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
			{children && <div className={styles.appendChildren}>{children}</div>}
		</div>
	);
};

export default withRouter<ResolveProps>(DocCard);
