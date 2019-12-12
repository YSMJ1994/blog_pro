import React, { useEffect, useState } from 'react';
import docArray from '@/assets/md';

export interface MdDoc {
	id: number;
	title: string;
	createTime: number;
	modifyTime: number;
	group: string[];
	tag?: string[];
	review: string;
	content: string;
}

export interface Tag {
	articles: MdDoc[];
	size: number;
	name: string;
}

export interface Group {
	name: string;
	articles: MdDoc[];
	groups?: Group[];
}

export interface DocInfo {
	articles: MdDoc[];
	tags: Tag[];
	group: Group[];
	tagMap: { [name: string]: Tag };
	articleMap: { [title: string]: MdDoc };
}

const DocCtx = React.createContext<DocInfo>({
	articles: [],
	tags: [],
	group: [],
	tagMap: {},
	articleMap: {}
});

function resolveTags(docArray: MdDoc[], result: Tag[]): void {
	let tagObj: { [key: string]: MdDoc[] } = {};
	docArray.forEach(doc => {
		const { tag } = doc;
		if (tag) {
			Array.from(new Set(tag)).forEach(t => {
				if (!tagObj[t]) {
					tagObj[t] = [];
				}
				tagObj[t].push(doc);
			});
		}
	});
	Object.keys(tagObj)
		.sort((a, b) => (a > b ? 1 : -1))
		.forEach(name => {
			const articles = tagObj[name].sort((a, b) => b.createTime - a.createTime);
			result.push({
				name,
				size: articles.length,
				articles
			});
		});
}

interface GroupObjItem {
	key: string;
	name: string;
	articles: MdDoc[];
	parent: string;
}

function resolveGroupTree(groupList: GroupObjItem[], allGroupList: GroupObjItem[], result: Group[]) {
	groupList.forEach(group => {
		const { key, name, articles, parent } = group;
		const resultItem: Group = {
			name,
			articles
		};
		result.push(resultItem);
		const children = allGroupList.filter(g => g.parent === key).sort((a, b) => (a.name > b.name ? 1 : -1));
		if (children && children.length) {
			resultItem.groups = [];
			resolveGroupTree(children, allGroupList, resultItem.groups);
		}
	});
}

function resolveGroups(docArray: MdDoc[], result: Group[]): void {
	let groupObj: { [key: string]: GroupObjItem } = {};
	docArray.forEach(doc => {
		const { group } = doc;
		let key: string, name: string, parent: string;
		if (group && group.length) {
			// 将每个上级分组加入groupObj中
			group.forEach((g, i, arr) => {
				const key = arr.slice(0, i + 1).join('/');
				const item = {
					key,
					name: g,
					parent: i === 0 ? '' : arr.slice(0, i).join('/'),
					articles: []
				};
				if (!groupObj[key]) {
					groupObj[key] = item;
				} else {
					// console.log('已存在group key', key);
				}
			});
			key = group.join('/');
			// name = group.slice(-1)[0];
			// parent = group.slice(0, -1).join('/');
		} else {
			key = '无分组';
			name = '无分组';
			parent = '';
			if (!groupObj[key]) {
				groupObj[key] = {
					key,
					name,
					articles: [],
					parent
				};
			}
		}
		groupObj[key].articles.push(doc);
	});
	const keys = Object.keys(groupObj);
	const groupList = keys.map(key => groupObj[key]);
	// console.log('keys', keys);
	// console.log('groupList', groupList);
	const topGroup = keys
		.filter(key => !groupObj[key].parent)
		.sort((a, b) => (a > b ? 1 : -1))
		.map(key => groupObj[key]);
	// console.log('topGroup', topGroup);
	resolveGroupTree(topGroup, groupList, result);
}

function resolveTagMap(tags: Tag[]) {
	const result: { [key: string]: Tag } = {};
	return tags.reduce((pre, tag) => {
		const { name } = tag;
		pre[name] = tag;
		return pre;
	}, result);
}

export const Provider: React.FC = ({ children }) => {
	const [docInfo, setDocInfo] = useState<DocInfo>({
		articles: [],
		tags: [],
		group: [],
		tagMap: {},
		articleMap: {}
	});
	useEffect(() => {
		const tags: Tag[] = [],
			group: Group[] = [];
		resolveTags(docArray, tags);
		resolveGroups(docArray, group);
		const articles = docArray.sort((a, b) => b.createTime - a.createTime);
		const info: DocInfo = {
			articles,
			tags,
			group,
			tagMap: resolveTagMap(tags),
			articleMap: articles.reduce(
				(pre, article) => {
					pre[article.title] = article;
					return pre;
				},
				{} as { [title: string]: MdDoc }
			)
		};
		setDocInfo(info);
	}, [docArray]);
	return <DocCtx.Provider value={docInfo}>{children}</DocCtx.Provider>;
};

export default DocCtx;

interface Person {
	name: string;
	age: number;
}

type Person1 = Readonly<Person>;
type Person2 = Partial<Person>;

type Readonly2<T> = { readonly [k in keyof T]: T[k] };

type Partial2<T> = { [k in keyof T]?: T[k] };
