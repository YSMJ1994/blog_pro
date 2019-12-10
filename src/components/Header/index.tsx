import React, { useContext, useEffect, useState, useRef, CSSProperties, FC } from 'react';
import Styles from './style.module.scss';
import Search from '@/components/Search';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import SIcon from '@/components/SIcon';
import CustomLink from '@/components/Link';
import cs from 'classnames';
import InfoCtx from '@/ctx/InfoCrx';
import defaultAvatar from '@/assets/img/avatar.jpeg';
import useTimeout from '@/utils/useTimeout';

interface MenuItemProps extends RouteComponentProps {
	label: string;
	link: string;
	cross?: boolean;
	onClick?: (e?: MouseEvent) => void;
}
const MenuItem = withRouter<MenuItemProps>(({ label, link, cross = false, history, location, onClick }) => {
	const [active, setActive] = useState(false);
	const { pathname } = location;
	useEffect(() => {
		// 去文章详情页面不改变导航栏激活状态
		if (/^\/article/.test(pathname)) {
			return;
		}
		if (link === '/') {
			setActive(pathname === link);
		} else {
			setActive(pathname.startsWith(link));
		}
	}, [pathname]);
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

const Header: FC<{ className?: string; style: CSSProperties }> = ({ className, style }) => {
	const [avatar, setAvatar] = useState('');
	const [phoneShowMenu, setPhoneShowMenu] = useState(false);
	const info = useContext(InfoCtx);
	const [hide, setHide] = useState<boolean>(false);
	const timeoutRef = useRef<NodeJS.Timeout>();
	const { avatar_url, name } = info;
	useEffect(() => {
		setAvatar(avatar_url);
	}, [avatar_url]);

	useEffect(() => {
		let beforeScrollY = window.scrollY;
		const listener = () => {
			if (!beforeScrollY) {
				beforeScrollY = window.scrollY;
			}
			const scrollY = window.scrollY;
			const offset = scrollY - beforeScrollY;
			if (offset < -20 || scrollY <= 0) {
				// 上滑50px则显示header
				if (hide && !timeoutRef.current) {
					// timeoutRef.current && clearTimeout(timeoutRef.current);
					timeoutRef.current = setTimeout(() => {
						setHide(false);
						timeoutRef.current = undefined;
					}, 200);
				}
				// hide && setHide(false);
				// 记录
				beforeScrollY = scrollY;
			} else if (offset > 20) {
				// 下滑50px则隐藏header
				if (!hide && !timeoutRef.current) {
					// timeoutRef.current && clearTimeout(timeoutRef.current);
					timeoutRef.current = setTimeout(() => {
						setHide(true);
						timeoutRef.current = undefined;
					}, 200);
				}
				// !hide && setHide(true);
				// 记录scrollY
				beforeScrollY = scrollY;
			}
		};
		window.addEventListener('scroll', listener);
		return () => {
			window.removeEventListener('scroll', listener);
		};
	}, [hide]);
	return (
		<header className={cs(Styles.header, className, { [Styles.headerHide]: hide })} style={style}>
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
};

export default Header;
