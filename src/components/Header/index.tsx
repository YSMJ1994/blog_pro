import React, { useState } from 'react';
import Styles from './style.module.scss';
import Search from '@/components/Search';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import SIcon from '@/components/SIcon';
import CustomLink from '@/components/Link';
import cs from 'classnames';

interface MenuItemProps extends RouteComponentProps {
	label: string;
	link: string;
}
const MenuItem = withRouter<MenuItemProps>(({ label, link, history, location }) => {
	const active = location.pathname === link;
	return (
		<CustomLink
			active={active}
			onClick={() => {
				history.push(link);
			}}
			className={cs(Styles.menuItem, { [Styles.menuItemActive]: active })}
		>
			{label}
		</CustomLink>
	);
});

function MenuList({ className, setPhoneShowMenu }: { className?: string; setPhoneShowMenu: (show: boolean) => void }) {
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
	return (
		<div className={cs(Styles.menuList, className)} onClick={() => setPhoneShowMenu(false)}>
			<div className={Styles.menuMain} onClick={e => e.stopPropagation()}>
				{menu.map(item => (
					<MenuItem key={item.label} label={item.label} link={item.link} />
				))}
			</div>
		</div>
	);
}

function Header() {
	const [phoneShowMenu, setPhoneShowMenu] = useState(false);
	return (
		<div className={Styles.header}>
			<SIcon name="menu" className={Styles.menuIcon} onClick={() => setPhoneShowMenu(!phoneShowMenu)} />
			<Link to="/" style={{ fontSize: 0 }}>
				<img
					title="Home"
					alt="loading"
					className={Styles.avatar}
					src="https://avatars1.githubusercontent.com/u/18289306?s=460&v=4"
				/>
			</Link>
			<div className={Styles.name}>SoberZ</div>
			<MenuList className={cs({ [Styles.menuShow]: phoneShowMenu })} setPhoneShowMenu={setPhoneShowMenu} />
			<Search />
		</div>
	);
}

export default Header;
