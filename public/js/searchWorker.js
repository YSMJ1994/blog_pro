function string2regstr(str) {
	return str.replace(/([.\\\[\]^$()?:*+|{},=!])/gi, '\\$1');
}

function string2regPart(str) {
	return new RegExp(
		`(${string2regstr(str)
			.split(/\s+/)
			.join('|')})`,
		'gi'
	);
}

function string2regFull(str) {
	return new RegExp(`(${string2regstr(str)})`, 'gi');
}

function wrapKeyword(keyword) {
	return `<span class="keyword-highlight">${keyword}</span>`;
}

onmessage = function({ data }) {
	// console.log('Worker: Message receive data from main script', data);
	let { keyword, docInfo } = data;
	// 搜索算法准则： 权重占比（完全匹配权重+4，包含keyword权重+2，包含部分keyword权重+1）
	// postMessage({ data, msg: 'worker received!' });
	keyword = String(keyword).trim();
	const { tags, group: groups, articles } = docInfo;
	const resultTags = [],
		resultGroups = [],
		resultArticles = [];
	const keywordPartReg = string2regPart(keyword);
	const keywordFullReg = string2regFull(keyword);
	const keywordRegStr = string2regstr(keyword);
	const keywordSentenceReg = new RegExp(`[^，,;；。.\\b\\r\\n]*(${keywordRegStr})[^，,;；。.\\b\\r\\n]*`, 'i');
	const keywordSingleSentenceReg = new RegExp(
		`[^，,;；。.\\b\\r\\n]*(${keywordRegStr.split(/\s+/).join('|')})[^，,;；。.\\b\\r\\n]*`,
		'i'
	);
	tags.forEach(tag => {
		let weight = 0;
		const { name } = tag;
		let match;
		if (name === keyword) {
			weight += 4;
			match = wrapKeyword(name);
		} else if (name.includes(keyword)) {
			weight += 2;
			match = name.replace(keyword, wrapKeyword(keyword));
		} else if (keywordPartReg.test(name)) {
			weight += 1;
			match = name.replace(keywordPartReg, wrapKeyword);
		}
		if (weight) {
			resultTags.push({
				weight,
				name,
				match
			});
		}
	});
	groups.forEach(group => {
		let weight = 0;
		const { name } = group;
		let match;
		if (name === keyword) {
			weight += 4;
			match = wrapKeyword(name);
		} else if (name.includes(keyword)) {
			weight += 2;
			match = name.replace(keyword, wrapKeyword(keyword));
		} else if (keywordPartReg.test(name)) {
			weight += 1;
			match = name.replace(keywordPartReg, wrapKeyword);
		}
		if (weight) {
			resultGroups.push({
				weight,
				name,
				match
			});
		}
	});
	articles.forEach(article => {
		let { id, title, content } = article;
		let weight = 0,
			matchTitle,
			match;
		if (title === keyword) {
			weight += 4;
			matchTitle = wrapKeyword(title);
		} else if (title.includes(keyword)) {
			weight += 2;
			matchTitle = title.replace(keyword, wrapKeyword(keyword));
		} else if (keywordPartReg.test(title)) {
			weight += 1;
			matchTitle = title.replace(keywordPartReg, wrapKeyword);
		}
		// 去除所有html标签
		content = content.replace(/<\/?\w+(?:.*?)>/gi, '');

		if (content === keyword) {
			weight += 4;
			match = wrapKeyword(content.slice(0, 20));
		} else if (content.includes(keyword)) {
			weight += 2;
			match = content.match(keywordSentenceReg)[0];
			match = match.replace(keywordFullReg, wrapKeyword);
		} else if (keywordPartReg.test(content)) {
			weight += 1;
			match = content.match(keywordSingleSentenceReg)[0];
			match = match.replace(keywordPartReg, wrapKeyword);
		}

		if (weight) {
			resultArticles.push({
				id,
				weight,
				title,
				matchTitle,
				match
			});
		}
	});
	postMessage({
		tags: resultTags
			.sort((a, b) => b.weight - a.weight || (a.name > b.name ? -1 : 1))
			.map(({ name, match }) => ({ name, match })),
		groups: resultGroups
			.sort((a, b) => b.weight - a.weight || (a.name > b.name ? -1 : 1))
			.map(({ name, match }) => ({ name, match })),
		articles: resultArticles
			.sort((a, b) => b.weight - a.weight || (a.title > b.title ? -1 : 1))
			.map(({ id, match, matchTitle, title }) => ({ id, match, title: matchTitle || title }))
	});
};
