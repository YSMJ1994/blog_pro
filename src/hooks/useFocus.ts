import React, { useRef, useEffect } from 'react';

type FocusHandler = (e: FocusEvent) => any;

export default function useFocus<E extends HTMLElement>(onFocus: FocusHandler, onBlur?: FocusHandler) {
	const ref = useRef<E>(null);
	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const target = ref.current;
		const listenFocus: FocusHandler = ev => {
			onFocus(ev);
		};
		const listenBlur: FocusHandler = ev => {
			onBlur && onBlur(ev);
		};
		target.addEventListener('focus', listenFocus);
		target.addEventListener('blur', listenBlur);
		return () => {
			target.removeEventListener('focus', listenFocus);
			target.removeEventListener('blur', listenBlur);
		};
	}, [ref.current, onFocus, onBlur]);
	return ref;
}
