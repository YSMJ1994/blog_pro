import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import cs from 'classnames';
import Styles from './Pages.module.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Aside from '@/components/Aslide';
import useScrollToTop from '@/hooks/useScrollToTop';
import asyncComponent from '@/components/asyncComponent';
import { HashRouter as Router, Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import WithAnimateShow, { AnimateShowWrapperProps } from '@/hoc/WithAnimateShow';
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

interface MainWrapProps {
	className?: string;
	style?: CSSProperties;
}

type ResolveMainWrapProps = MainWrapProps & AnimateShowWrapperProps & RouteComponentProps<any>;

const AnimateMainWrap = WithAnimateShow<ResolveMainWrapProps>(({ className, style, history }) => {
	useEffect(() => {
		return history.listen((location, action) => {
			if (action === 'PUSH') {
				window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
			}
		});
	}, []);
	return (
		<div className={cs(Styles.main, className)} style={style}>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/about" component={About} />
				<Route path="/timeline" component={Timeline} />
				<Route path="/group/:name?" component={Group} />
				<Route path="/tags" component={Tags} />
				<Route path="/article/:id" component={Article} />
				<Redirect to="/" />
			</Switch>
		</div>
	);
});

const MainWrap = withRouter<ResolveMainWrapProps>(AnimateMainWrap);

export default function() {
	const info = useContext(InfoCtx);
	const { name = 'SoberZ', avatar_url } = info;
	const avatar = avatar_url || defaultAvatar;
	useEffect(() => {
		document.title = `${name}的个人博客`;
		// 动态改变ico
		// const shortcutLink = document.querySelector<HTMLLinkElement>('#shortcut');
		// shortcutLink && (shortcutLink.href = avatar_url);
	}, [name, avatar]);
	const ToTop = WithAnimateShow(useScrollToTop());
	useEffect(() => {
		document.body.addEventListener('touchstart', function() {});
	}, []);
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
