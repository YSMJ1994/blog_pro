import React, { useContext, useEffect, useState } from 'react';
import Styles from './style.module.scss';
import Search from '@/components/Search';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import SIcon from '@/components/SIcon';
import CustomLink from '@/components/Link';
import cs from 'classnames';
import InfoCtx from '@/ctx/InfoCrx';
import defaultAvatar from '@/assets/img/avatar.jpeg';

interface MenuItemProps extends RouteComponentProps {
	label: string;
	link: string;
	cross?: boolean;
	onClick?: (e?: MouseEvent) => void;
}
const MenuItem = withRouter<MenuItemProps>(({ label, link, cross = false, history, location, onClick }) => {
	const { pathname } = location;
	const active = link === '/' ? pathname === link : pathname.startsWith(link);
	return (
		<CustomLink
			active={active}
			to={cross ? link : undefined}
			onClick={e => {
				!cross && history.push(link);
				onClick && onClick();
			}}
			className={cs(Styles.menuItem, { [Styles.menuItemActive]: active })}
		>
			{label}
		</CustomLink>
	);
});

function MenuList({
	className,
	menu = [],
	setPhoneShowMenu
}: {
	className?: string;
	menu: { label: string; link: string; cross?: boolean }[];
	setPhoneShowMenu: (show: boolean) => void;
}) {
	return (
		<div className={cs(Styles.menuList, className)} onClick={() => setPhoneShowMenu(false)}>
			<div className={Styles.menuMain} onClick={e => e.stopPropagation()}>
				{menu.map(item => (
					<MenuItem
						key={item.label}
						label={item.label}
						link={item.link}
						cross={item.cross}
						onClick={() => setPhoneShowMenu(false)}
					/>
				))}
			</div>
		</div>
	);
}
const menu = [
	{
		label: '主页',
		link: '/'
	},
	{
		label: '关于',
		link: '/about'
	},
	{
		label: '标签',
		link: '/tags'
	},
	{
		label: '分类',
		link: '/group'
	},
	{
		label: '归档',
		link: '/timeline'
	}
];
function Header() {
	const [avatar, setAvatar] = useState('');
	const [phoneShowMenu, setPhoneShowMenu] = useState(false);
	const info = useContext(InfoCtx);
	const { avatar_url, name } = info;
	useEffect(() => {
		setAvatar(avatar_url);
	}, [avatar_url]);
	return (
		<header className={Styles.header}>
			<div className={Styles.headerInner}>
				<SIcon name="menu" className={Styles.menuIcon} onClick={() => setPhoneShowMenu(!phoneShowMenu)} />
				<Link to="/" style={{ fontSize: 0 }}>
					<img
						title="Home"
						alt="loading"
						className={Styles.avatar}
						src={avatar}
						onError={() => setAvatar(defaultAvatar)}
					/>
				</Link>
				<div className={Styles.name}>{name}</div>
				<MenuList
					className={cs({ [Styles.menuShow]: phoneShowMenu })}
					menu={menu}
					setPhoneShowMenu={setPhoneShowMenu}
				/>
			</div>
			<Search />
		</header>
	);
}

export default Header;
