import { useEffect, useRef } from 'react';

type anyFn = ([...any]?) => any;
export default function useTimeout(cb: anyFn, delay: number) {
	const ref = useRef<anyFn>();
	useEffect(() => {
		ref.current = cb;
	});
	useEffect(() => {
		const tickCb = () => (ref as { current: anyFn }).current();
		if (typeof delay !== 'undefined') {
			const id = setTimeout(tickCb, delay);
			return () => clearTimeout(id);
		}
	}, [delay]);
}
