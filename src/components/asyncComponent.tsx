import React, { useState, useEffect } from 'react';

export default function asyncComponent<PropsType extends {}>(targetFn: () => Promise<any>): React.FC<PropsType> {
	return function AsyncComp(props) {
		const [Target, setTarget]: [any, any] = useState(null);
		useEffect(() => {
			targetFn()
				.then(res => {
					setTarget(() => res.default);
				})
				.catch(() => {
					setTarget(null);
				});
		}, [targetFn]);
		return Target && <Target {...props} />;
	};
}
