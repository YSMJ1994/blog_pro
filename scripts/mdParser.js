const fs = require('fs-extra');
const path = require('path');
const markdownItConfig = require('../markdownit.config');
const MarkdownIt = require('markdown-it')(markdownItConfig);
const Prettier = require('prettier');
const PrettierConfig = {
	...require('../.prettierrc.js'),
	parser: 'babel'
};
const projectRoot = process.cwd();
const mdBase = path.resolve(projectRoot, './doc');
const resultBase = path.resolve(projectRoot, './src/assets/md/');
const outSuffix = '.js';
const indexPath = resultBase + '/index' + outSuffix;

let cacheJsPath = [];

async function asyncForEach(arr, callback) {
	for (let i = 0, len = arr.length; i < len; i++) {
		await callback(arr[i], i, arr);
	}
}

async function cleanDir(dirPath) {
	if (`${dirPath}`.startsWith(projectRoot)) {
		await fs.ensureDir(dirPath);
		const indexExist = await fs.exists(indexPath);
		if (!indexExist) {
			await fs.emptyDir(dirPath);
		} else {
			await fs.writeFile(indexPath, 'export default []');
			const files = await fs.readdir(dirPath);
			await asyncForEach(files, async childName => {
				const childPath = dirPath + '/' + childName;
				const stat = await fs.stat(childPath);
				if (stat.isDirectory() || childName !== 'index' + outSuffix) {
					await fs.remove(childPath);
				}
			});
		}
	} else {
		return Promise.reject('只能操作项目下的目录');
	}
	return true;
}

async function getInfo(content, filePath = '') {
	const { birthtimeMs, mtimeMs } = await fs.stat(filePath);
	const info = {
		id: parseInt(birthtimeMs),
		title: '',
		tag: [],
		createTime: birthtimeMs,
		modifyTime: mtimeMs,
		group: [],
		review: '',
		content: ''
	};
	const titleRegExp = /\[title]:\s*#\((.+)\)/;
	// 文件名（无后缀）
	const filename = filePath.match(/\/(.+).md$/)[1];
	info.title = (content.match(titleRegExp) || [])[1] || filename;
	const tagRegExp = /\[tag]:\s*#\((.+)\)/;
	let tag = (content.match(tagRegExp) || [])[1] || '';
	info.tag = tag
		.split(/[,，]/)
		.filter(t => t)
		.map(t => `${t}`.trim());
	const reviewRegExp = /\[preview]:\s*#\(start\)((?:.|\r|\n)+)\[preview]:\s*#\(end\)/;
	info.review = (content.match(reviewRegExp) || [])[1] || '';
	let relativePath = filePath.slice(filePath.lastIndexOf('doc') + 3);
	let groupArr = Array.from(relativePath.match(/[\/\\]+[^\/\\]+/g));
	groupArr.pop();
	info.group = groupArr.map(group => `${group}`.replace(/^[\/\\]+/, ''));
	return info;
}

async function parseMd(filePath, resultPath) {
	const buffer = await fs.readFile(filePath);
	const content = buffer.toString('utf8');
	const info = await getInfo(content, filePath);
	let review = MarkdownIt.render(info.review);
	// info.review = review.replace(/[\n\r]/g, '');
	info.review = review;
	let html = MarkdownIt.render(content);
	// html = html.replace(/[\n\r]/g, '');
	info.content = html;
	let moduleHtml = `export default ${JSON.stringify(info)}`;
	resultPath = resultPath.replace(/\.md$/, outSuffix);
	const bos = fs.createWriteStream(resultPath);
	moduleHtml = Prettier.format(moduleHtml, PrettierConfig);
	bos.write(moduleHtml, 'utf8');
	cacheJsPath.push(resultPath.replace(resultBase, './').replace(/\.\/{2,}/, './'));
}

async function parseDir(dirPath, resultPath) {
	const flieNames = await fs.readdir(dirPath);
	await asyncForEach(flieNames, async fileName => {
		const filePath = dirPath + '/' + fileName;
		const resPath = resultPath + '/' + fileName;
		const stat = await fs.stat(filePath);
		if (stat.isDirectory()) {
			await fs.ensureDir(resPath);
			await parseDir(filePath, resPath);
		} else {
			await parseMd(filePath, resPath);
		}
	});
}

async function exportIndex() {
	await fs.ensureFile(indexPath);
	let importContent = '';
	let exportContent = 'export default [\n';
	await asyncForEach(cacheJsPath, async (relativePath, i) => {
		const moduleName = 'md_' + i;
		importContent += `import ${moduleName} from '${relativePath}'\n`;
		exportContent += `    ${moduleName}${i === cacheJsPath.length - 1 ? '' : ',\n'}`;
	});
	importContent += '\n';
	exportContent += '\n]';
	const content = importContent + exportContent;
	await fs.writeFile(indexPath, content);
}

async function parseIndex() {
	let indexStr = await fs.readFile(indexPath);
	indexStr = indexStr.toString('utf8');
	let exportIndex = indexStr.indexOf('export default');
	let importStr = indexStr.slice(0, exportIndex);
	let exportStr = indexStr.slice(exportIndex);
	return [importStr, exportStr];
}

function resolveRelativePath(mdPath) {
	return mdPath
		.replace(/\.md$/, outSuffix)
		.replace(mdBase, './')
		.replace(/\.\/{2,}/g, './');
}

async function resolveFileAdd(filePath) {
	let relativePath = resolveRelativePath(filePath);
	let resultPath = path.resolve(resultBase, relativePath);
	await fs.ensureFile(resultPath);
	await parseMd(filePath, resultPath);
	let [importStr, exportStr] = await parseIndex();
	importStr = importStr.replace(/\n{2,}/g, '\n');
	let currentMdIndex = 0;
	let mdModuleNameRegExp = /md_(\d+)/g;
	let match;
	do {
		match = mdModuleNameRegExp.exec(importStr);
		if (match) {
			let matchIndex = +match[1];
			if (matchIndex > currentMdIndex) {
				currentMdIndex = matchIndex;
			}
		}
	} while (match);
	currentMdIndex++;
	let newModuleName = `md_${currentMdIndex}`;
	importStr += `import ${newModuleName} from '${relativePath}'\n`;
	exportStr = exportStr.replace('\n]', `,\n    ${newModuleName}\n]`).replace(/\[\n?[\s\t]*,/, '[');
	const content = importStr + '\n' + exportStr;
	await fs.writeFile(indexPath, content);
}

async function resolveFileUnlink(mdPath) {
	let relativePath = resolveRelativePath(mdPath);
	let jsPath = path.resolve(resultBase, relativePath);
	let [importStr, exportStr] = await parseIndex();
	importStr = importStr.replace(/\n{2,}/g, '\n');
	let regRelativePath = relativePath.replace(/\./g, '\\.').replace(/\//g, '\\/');
	console.log('exportStr init', exportStr);
	console.log('regRelativePath', regRelativePath);
	let regexp = new RegExp(`import\\s(md_\\d+)\\sfrom\\s'${regRelativePath}'\\n`);
	let moduleName = '';
	importStr = importStr.replace(regexp, (match, $1) => {
		moduleName = $1;
		return '';
	});
	let exportRegExp = new RegExp(`(,)?\\n\\s+${moduleName}(,)?`);
	exportStr = exportStr.replace(exportRegExp, (match, $1, $2) => {
		if ($1 && $2) {
			return ',';
		} else {
			return '';
		}
	});
	console.log('exportStr result', exportStr);
	let content = importStr + '\n' + exportStr;
	await fs.writeFile(indexPath, content);
	await fs.remove(jsPath);
}

async function resolveDirAdd(dirPath) {
	let relativePath = resolveRelativePath(dirPath);
	let resultPath = path.resolve(resultBase, relativePath);
	fs.mkdirsSync(resultPath);
}

async function resolveDirUnlink(dirPath) {
	let relativePath = resolveRelativePath(dirPath);
	let resultPath = path.resolve(resultBase, relativePath);
	await fs.emptyDir(resultPath);
	await fs.remove(resultPath);
}

async function resolveFileChange(mdPath) {
	let relativePath = resolveRelativePath(mdPath);
	let jsPath = path.resolve(resultBase, relativePath);
	await parseMd(mdPath, jsPath);
}

async function compile() {
	cacheJsPath = [];
	await cleanDir(resultBase);
	await parseDir(mdBase, resultBase);
	await exportIndex();
}

const chokidar = require('chokidar');

async function initWatch() {
	return chokidar.watch(mdBase, {});
}

async function startWatch(watcher) {
	watcher.on('all', async (action, filePath, stat) => {
		switch (action) {
			case 'add': {
				await resolveFileAdd(filePath);
				break;
			}
			case 'unlink': {
				await resolveFileUnlink(filePath);
				break;
			}
			case 'change': {
				await resolveFileChange(filePath);
				break;
			}
			case 'addDir': {
				// compile()
				await resolveDirAdd(filePath);
				break;
			}
			case 'unlinkDir': {
				// compile()
				await resolveDirUnlink(filePath);
				break;
			}
		}
	});
}

let watcher;

async function run() {
	watcher = await initWatch();
	await compile();
	await startWatch(watcher);
	return watcher;
}

function close() {
	watcher && watcher.close();
}

module.exports = {
	run,
	compile,
	close
};
