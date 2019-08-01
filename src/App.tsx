import React from 'react';
import '@/styles/fix.scss';
import '@/styles/global.scss';
import 'highlight.js/styles/atom-one-dark.css';
import Pages from '@/pages/Pages';
import { load } from 'utils/loadIcon';
load();
import { Provider } from '@/ctx/DocCtx';

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
