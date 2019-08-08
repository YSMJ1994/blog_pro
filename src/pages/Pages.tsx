import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import cs from 'classnames';
import Styles from './Pages.module.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Aside from '@/components/Aslide';
import useScrollToTop from '@/hooks/useScrollToTop';
import asyncComponent from '@/components/asyncComponent';
import { HashRouter as Router, Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import WithAnimateShow from '@/hoc/WithAnimateShow';
import WithPageWrapper from '@/hoc/WithPageWrapper';
const Home = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "home" */ './Home')));
const About = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "about" */ './About')));
const Timeline = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "timeline" */ './Timeline')));
const Tags = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "tags" */ './Tags')));
const Group = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "group" */ './Group')));
const Article = WithPageWrapper(asyncComponent(() => import(/* webpackChunkName: "article" */ './Article')));
const AsideWrapped = WithAnimateShow(Aside);
import InfoCtx from '@/ctx/InfoCrx';
import defaultAvatar from '@/assets/img/avatar.jpeg';

const MainWrap = WithAnimateShow<{ className?: string; style?: CSSProperties }>(({ className, style }) => {
	return (
		<div className={cs(Styles.main, className)} style={style}>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/about" component={About} />
				<Route path="/timeline" component={Timeline} />
				<Route path="/group" component={Group} />
				<Route path="/tags" component={Tags} />
				<Route path="/article/:title" component={Article} />
				<Redirect to="/" />
			</Switch>
		</div>
	);
});

export default function() {
	const info = useContext(InfoCtx);
	const { name = 'SoberZ', avatar_url } = info;
	const avatar = avatar_url || defaultAvatar;
	useEffect(() => {
		document.title = `${name}的个人博客`;
		// const shortcutLink = document.querySelector<HTMLLinkElement>('#shortcut');
		// shortcutLink && (shortcutLink.href = avatar_url);
	}, [name, avatar]);
	const ToTop = WithAnimateShow(useScrollToTop());
	return (
		<Router>
			<Header />
			<div className={Styles.root}>
				<MainWrap direction="down" />
				<AsideWrapped direction="right" className={Styles.aside} delay={1000} />
			</div>
			<Footer />
			<ToTop className={Styles.toTop} direction="right" />
		</Router>
	);
}
