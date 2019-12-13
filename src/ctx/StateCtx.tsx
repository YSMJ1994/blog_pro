import React, { FC, useState } from 'react';

export interface State {
	searchFocus: boolean;
	searchPaneShow: boolean;
	scrollElement: HTMLElement;
}

export interface Dispatcher {
	setState(state: Partial<State>): any;
}

const initState: State = {
	searchFocus: false,
	searchPaneShow: false,
	scrollElement: document.documentElement
};

const initDispatcher: Dispatcher = {
	setState(state: Partial<State>): any {}
};

const ctxState = {
	...initState,
	...initDispatcher
};

const State = React.createContext<State & Dispatcher>(ctxState);

export const Provider: FC = ({ children }) => {
	const [state, setState] = useState<State>(initState);
	const stateRes = {
		...state,
		setState(newState: Partial<State>) {
			setState(preState => ({
				...preState,
				...newState
			}));
		}
	};
	return <State.Provider value={stateRes}>{children}</State.Provider>;
};

export default State;
