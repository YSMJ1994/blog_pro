import React from 'react';
import Header from '@/components/Header';
import Styles from './Pages.module.scss';
import asyncComponent from '@/components/asyncComponent';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
const Home = asyncComponent(() => import(/* webpackChunkName: "home" */ './Home'));
const About = asyncComponent(() => import(/* webpackChunkName: "about" */ './About'));

export default function() {
	return (
		<Router>
			<div className="router-base">
				<Header />
				<div className={Styles.main}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/about" component={About} />
						<Redirect to="/" />
					</Switch>
				</div>
			</div>
		</Router>
	);
}
