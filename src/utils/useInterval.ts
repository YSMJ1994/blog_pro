import { useEffect, useRef } from 'react';

type anyFn = ([...any]?) => any;
export default function useInterval(cb: anyFn, delay: number) {
	const ref = useRef<anyFn>();
	useEffect(() => {
		ref.current = cb;
	});
	useEffect(() => {
		const tickCb = () => (ref as { current: anyFn }).current();
		if (typeof delay !== 'undefined') {
			const id = setInterval(tickCb, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
