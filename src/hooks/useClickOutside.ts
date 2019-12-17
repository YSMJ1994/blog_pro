import React, { useRef, useEffect } from 'react';

export default function useClickOutside<E extends HTMLElement>(clickOutsideHandler: (e: MouseEvent) => any) {
	const ref = useRef<E>(null);
	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const clickListener = (e: MouseEvent) => {
			const pane = ref.current,
				target = e.target as Node;
			if (!pane || !target) {
				return;
			}
			if (pane !== target && !pane.contains(target)) {
				clickOutsideHandler(e);
			}
		};
		document.body.addEventListener('click', clickListener);
		return () => {
			document.body.removeEventListener('click', clickListener);
		};
	}, [ref.current, clickOutsideHandler]);
	return ref;
}
