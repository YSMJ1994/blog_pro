import React, { FC, PropsWithChildren } from 'react';

const combine = (providers: FC[]): FC => (props: PropsWithChildren<{}>) => {
	const Provider = providers[0];
	if (!providers.length) {
		return <>{props.children}</>;
	}
	if (providers.length === 1) {
		const Provider = providers[0];
		return <Provider {...props} />;
	} else {
		const NextProvider = combine(providers.slice(1));
		return (
			<Provider>
				<NextProvider {...props} />
			</Provider>
		);
	}
};
export default combine;
