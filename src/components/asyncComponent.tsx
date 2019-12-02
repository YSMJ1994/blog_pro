import React, { useState, useEffect } from 'react';

export default function asyncComponent<P extends {}>(targetFn: () => Promise<{ default: RC<P> }>): RC<P> {
	return function AsyncCompWrapper(props) {
		const [Target, setTarget] = useState<RC<P> | null>(null);
		useEffect(() => {
			let isMounted = true;
			targetFn()
				.then(res => {
					isMounted && setTarget(() => res.default);
				})
				.catch(() => {
					isMounted && setTarget(null);
				});
			return () => {
				isMounted = false;
			};
		}, [targetFn]);
		return Target && <Target {...props} />;
	};
}
