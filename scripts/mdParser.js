const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const { appDoc, appDocIndex } = require('../config/paths');

const executeDelay = (function() {
	const delayTagMap = new Map();
	return function(task, delay) {
		clearTimeout(delayTagMap.get(task));
		delayTagMap.set(task, setTimeout(task, delay));
	};
})();

async function parseMd(filePath, mdArr) {
	if (!/\.md$/.test(filePath)) {
		return;
	}
	mdArr.push({
		relativePath: path.relative(path.dirname(appDocIndex), filePath)
	});
}

async function parseDir(dirPath, mdArr) {
	const children = await fs.readdir(dirPath);
	for (const fileName of children) {
		const filePath = path.resolve(dirPath, fileName);
		const stat = await fs.stat(filePath);
		if (stat.isDirectory()) {
			await parseDir(filePath, mdArr);
		} else {
			await parseMd(filePath, mdArr);
		}
	}
}

async function exportIndex(mdArr) {
	await fs.ensureFile(appDocIndex);
	const content = `${mdArr
		.map(({ relativePath }, i) => {
			return `import md_${i} from '${relativePath}';`;
		})
		.join('\n')}

export default [${mdArr
		.map((t, i) => {
			return `md_${i}`;
		})
		.join(', ')}]
`;
	await fs.writeFile(appDocIndex, content);
}

async function compile() {
	const mdArr = [];
	await fs.ensureFile(appDocIndex);
	await parseDir(appDoc, mdArr);
	await exportIndex(mdArr);
}

async function initWatch() {
	return chokidar.watch(appDoc, {
		ignoreInitial: true
	});
}

async function startWatch(watcher) {
	watcher.on('all', async (action, filePath, stat) => {
		switch (action) {
			case 'add': {
				executeDelay(compile, 100);
				break;
			}
			case 'unlink': {
				executeDelay(compile, 100);
				break;
			}
			case 'addDir': {
				executeDelay(compile, 100);
				break;
			}
			case 'unlinkDir': {
				executeDelay(compile, 100);
				break;
			}
		}
	});
}

let watcherUtil = (function() {
	let watcher;
	return {
		async watch() {
			if (!watcher) {
				watcher = await initWatch();
			}
			await startWatch(watcher);
		},
		close() {
			watcher && watcher.close();
		}
	};
})();

function close() {
	watcherUtil.close();
}

async function run() {
	await compile();
	await watcherUtil.watch();
}

module.exports = {
	run,
	compile,
	close
};
