/*
------------------------------------------------------------
	author: SoberZ
	create: 2020-01-09 15:36:58
	description: 取消目标dom滚动穿透hooks
------------------------------------------------------------
*/
import { useEffect } from 'react';

export default function useScrollLock(targetDom: HTMLElement | null) {
	useEffect(() => {
		if (targetDom) {
			const listener = function(ev: WheelEvent) {
				// 阻止滚轮滚动事件，手动模拟滚动
				const { deltaX, deltaY } = ev;
				targetDom.scrollTop += deltaY;
				targetDom.scrollLeft += deltaX;
				ev.preventDefault();
			};
			targetDom.addEventListener('wheel', listener);
			return () => targetDom.removeEventListener('wheel', listener);
		}
	}, [targetDom]);
}
