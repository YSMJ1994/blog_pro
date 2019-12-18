import React from 'react';
import './init';
import Pages from '@/pages/Pages';
import combineCtxProvider from '@/utils/combineCtxProvider';
import { Provider as DocProvider } from '@/ctx/DocCtx';
import { Provider as InfoProvider } from '@/ctx/InfoCrx';
import { Provider as StateProvider } from '@/ctx/StateCtx';
import { Provider as BlogInfoProvider } from '@/ctx/BlogInfo';

const Provider = combineCtxProvider([DocProvider, InfoProvider, StateProvider, BlogInfoProvider]);
const App: React.FC = () => {
	return (
		<div className="App">
			<Provider>
				<Pages />
			</Provider>
		</div>
	);
};

export default App;
