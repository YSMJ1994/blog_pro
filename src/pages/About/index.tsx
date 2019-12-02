import React from 'react';
import cs from 'classnames';
import PageTitle from '@/components/PageTitle';
import styles from './style.module.scss';

const About = ({ className }: { className?: string }) => {
	return (
		<div className={cs(styles.about, className)}>
			<PageTitle title="关于我" icon="about" />
		</div>
	);
};

export default About;
