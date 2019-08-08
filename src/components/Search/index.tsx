import React, { useRef, useState, useEffect } from 'react';
import cs from 'classnames';
import styles from './index.module.scss';

type SearchingResult =
	| {
			type: string;
			list: {
				title: string;
				createTime: number | null;
				updateTime: number | null;
				description: string | null;
			}[];
	  }[]
	| null;
function SearchPane({ keyword, inputFocus = false }: { keyword: string; inputFocus: boolean }) {
	const [result, setResult] = useState<SearchingResult>(null);
	const [show, setShow] = useState(true);
	useEffect(() => {
		// searching
	}, [keyword]);
	return <div className={cs(styles.searchPane, { [styles.searchPaneShow]: inputFocus && !!keyword })}>11</div>;
}

export default function Search() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [focus, setFocus] = useState(false);
	const [keyword, setKeyword] = useState('');
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
	return (
		<div className={cs(styles.search, { [styles.searchFocus]: focus })}>
			<input
				ref={inputRef}
				className={styles.searchInput}
				value={keyword}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(`${e.target.value}`.trim())}
			/>
			<a className={styles.cancelText} href="javascript:" onClick={() => setFocus(false)}>
				取消
			</a>
			<SearchPane inputFocus={focus} keyword={keyword} />
		</div>
	);
}
