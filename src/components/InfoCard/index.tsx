import React, { useContext, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import DocCtx from '@/ctx/DocCtx';
import InfoCtx from '@/ctx/InfoCrx';
import styles from './style.module.scss';
import SIcon from '@/components/SIcon';
import defaultAvatar from '@/assets/img/avatar.jpeg';

const InfoCard: React.FC<RouteComponentProps> = ({ history }) => {
	const docList = useContext(DocCtx);
	const info = useContext(InfoCtx);
	const { avatar_url, name, bio, followers, following, html_url, email } = info;
	const [avatar, setAvatar] = useState(avatar_url);
	const docCount = docList.articles.length;
	const groupCount = docList.group.length;
	const tagCount = docList.tags.length;
	useEffect(() => {
		setAvatar(avatar_url);
	}, [avatar_url]);
	return (
		<div className={styles.infoCard}>
			<div className={styles.author}>
				<img
					className={styles.avatar}
					src={avatar}
					alt=""
					onError={err => {
						console.log('error', err);
						setAvatar(defaultAvatar);
					}}
				/>
				<div className={styles.name}>{name}</div>
				<div className={styles.bio}>{bio}</div>
			</div>
			<div className={styles.docInfo}>
				<div className={styles.docInfoItem} onClick={() => history.push('/timeline')}>
					<div className={styles.docInfoItemCount}>{docCount}</div>
					<div className={styles.docInfoItemLabel}>文章</div>
				</div>
				<div className={styles.docInfoItem} onClick={() => history.push('/group')}>
					<div className={styles.docInfoItemCount}>{groupCount}</div>
					<div className={styles.docInfoItemLabel}>分类</div>
				</div>
				<div className={styles.docInfoItem} onClick={() => history.push('/tags')}>
					<div className={styles.docInfoItemCount}>{tagCount}</div>
					<div className={styles.docInfoItemLabel}>标签</div>
				</div>
			</div>
			<div className={styles.thirdPartInfo}>
				<a href={html_url} target="_blank" className={styles.thirdPartInfoItem}>
					<SIcon className={styles.thirdPartInfoItemIcon} name="github" />
					<span className={styles.thirdPartInfoItemLabel}>GitHub</span>
				</a>
				<a href={`mailto:${email}`} target="_self" className={styles.thirdPartInfoItem}>
					<SIcon className={styles.thirdPartInfoItemIcon} name="email" style={{ fontSize: '1rem' }} />
					<span className={styles.thirdPartInfoItemLabel}>Email</span>
				</a>
				<a href="https://www.npmjs.com/~soberz" target="_blank" className={styles.thirdPartInfoItem}>
					<SIcon className={styles.thirdPartInfoItemIcon} name="npm" style={{ fontSize: '1rem' }} />
					<span className={styles.thirdPartInfoItemLabel}>npm</span>
				</a>
			</div>
		</div>
	);
};

export default withRouter(InfoCard);
