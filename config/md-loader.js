const fs = require('fs-extra');
const path = require('path');
const {appDoc} = require('./paths')
const markdownItConfig = require('../markdownit.config');
const MDT = require('markdown-it')(markdownItConfig);
const titleRegExp = /\[title]:\s*#\((.+)\)/;
const tagRegExp = /\[tag]:\s*#\((.+)\)/;
const reviewRegExp = /\[preview]:\s*#\(start\)([\s\S]+)\[preview]:\s*#\(end\)/;

async function mdLoader(source) {
	const callback = this.async();
	const mdPath = this.resourcePath;
	const filename = path.basename(mdPath, '.md');
	const { birthtimeMs, mtimeMs } = await fs.stat(mdPath);
	const title = (source.match(titleRegExp) || [])[1] || filename;
	source = source.replace(titleRegExp, '');
	const tagStr = (source.match(tagRegExp) || [])[1] || '';
	source = source.replace(tagRegExp, '');
	const tag = tagStr
		.split(/[,，]/)
		.filter(t => t)
		.map(t => `${t}`.trim());
	const relativePath = mdPath.replace(appDoc, '')
	const group = relativePath.split(path.sep).filter(t => t).slice(0, -1)
	const reviewStr = (source.match(reviewRegExp) || [])[1] || '';
	source = source.replace(reviewRegExp, '');
	const review = MDT.render(reviewStr)
	const content = MDT.render(source)
	const md = {
		id: parseInt(birthtimeMs),
		title,
		tag,
		createTime: birthtimeMs,
		modifyTime: mtimeMs,
		group,
		review,
		content
	};
	
	callback(null, `export default ${JSON.stringify(md)}`);
}

module.exports = mdLoader;
