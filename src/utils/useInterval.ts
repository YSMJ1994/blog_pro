import { useEffect, useRef } from 'react';

/**
 * 定时任务
 * @param handler 执行函数
 * @param delay 间隔时间 设为null则停止执行
 * @return stop function 停止函数
 */
export default function useInterval<F extends Function>(handler: F, delay: number | null) {
	const ref = useRef<F>(handler);
	const stopTagRef = useRef<NodeJS.Timeout>();
	ref.current = handler;
	useEffect(() => {
		if (delay === null) {
			return;
		}
		const tickCb = () => ref.current();
		const id = setInterval(tickCb, delay);
		stopTagRef.current = id;
		return () => clearInterval(id);
	}, [delay]);
	return function stop() {
		stopTagRef.current && clearInterval(stopTagRef.current);
	};
}
