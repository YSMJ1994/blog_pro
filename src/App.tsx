import React from 'react';
import '@/styles/fix.scss';
import '@/styles/global.scss';
import 'highlight.js/styles/atom-one-dark.css';
import Pages from '@/pages/Pages';
import loadIcon from '@/utils/loadIcon';
import combineCtxProvider from '@/utils/combineCtxProvider';
import { Provider as DocProvider } from '@/ctx/DocCtx';
import { Provider as InfoProvider } from '@/ctx/InfoCrx';
import 'moment/locale/zh-cn';
import Moment from 'moment';

Moment.locale('zh-cn');
loadIcon.load();

const Provider = combineCtxProvider([DocProvider, InfoProvider]);
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
