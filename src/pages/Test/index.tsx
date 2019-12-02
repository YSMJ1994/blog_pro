import React from 'react';
import cs from 'classnames';
import styles from './style.module.scss';
const Test = () => {
	const colors = ['green', 'blue', 'red', 'cyan', 'pink', 'purple', 'gray', 'yellow', 'orange'];
	const boxesArr: React.ReactElement[][] = [];
	colors.forEach(color => {
		const item = new Array(10);
		boxesArr.push(item);
		for (let i = 0; i < item.length; i++) {
			item[i] = <div key={`${color}_${i}`} className={cs(styles.box, styles[color])} />;
		}
	});
	console.log('box', boxesArr);
	return (
		<div className={styles.test}>
			{boxesArr.map((t, i) => (
				<div key={i}>{t}</div>
			))}
		</div>
	);
};

export default Test;
