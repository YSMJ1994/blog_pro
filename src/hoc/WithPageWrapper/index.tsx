import React, { ComponentClass, FC } from 'react';
import cs from 'classnames';
import styles from './index.module.scss';

const WithPageWrapper = <P extends { className?: string }>(Comp: FC<P> | ComponentClass<P>): FC<P> => {
	return (props: P) => {
		const { className } = props;
		return <Comp {...props} className={cs(styles.pageWrapper, className)} />;
	};
};

export default WithPageWrapper;
