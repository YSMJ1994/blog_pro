import React, { useContext, FC } from 'react';
import styles from './style.module.scss';
import moment from 'moment';
import SIcon from '@/components/SIcon';
import InfoCrx from '@/ctx/InfoCrx';

const Footer: FC = () => {
	// const year = moment().year();
	// console.log('year', year);
	const { name } = useContext(InfoCrx);
	return (
		<footer className={styles.footer}>
			<div>
				&copy; 2019
				<SIcon name="github" className={styles.userIcon} />
				{name}
			</div>
			<div>
				Powered by
				<a href="https://react.docschina.org/" target="_blank">
					React v16.8.6
				</a>
				&
				<a href="https://react.docschina.org/" target="_blank">
					TypeScript v3.4.5
				</a>
			</div>
		</footer>
	);
};

export default Footer;
