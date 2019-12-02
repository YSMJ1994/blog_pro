import { useEffect, useRef } from 'react';

/**
 * 延迟任务
 * @param handler 执行函数
 * @param delay 延迟时间 设为null 则停止执行
 * @return stop function 停止函数
 */
export default function useTimeout<F extends Function>(handler: F, delay: number | null) {
	const ref = useRef<F>(handler);
	const stopTagRef = useRef<NodeJS.Timeout>();
	ref.current = handler;
	useEffect(() => {
		const tickCb = () => ref.current();
		if (delay === null) {
			return;
		}
		const id = setTimeout(tickCb, delay);
		stopTagRef.current = id;
		return () => clearTimeout(id);
	}, [delay]);
	return function stop() {
		stopTagRef.current && clearTimeout(stopTagRef.current);
	};
}
