function getKey(i, j) {
	return `${i}_${j}`;
}

function getIJByKey(key) {
	return key.split('_').map(n => +n);
}

function test(str) {
	const arr = str.split(' ').reduce((pre, tag, i) => {
		let rowNum = Math.floor(i / 10);
		let columnNum = i % 10;
		if (!pre[columnNum]) {
			pre[columnNum] = [];
		}
		pre[columnNum][rowNum] = tag;
		return pre;
	}, []);
	const findMap = {};
	let findKey;
	let maxLen = 0;
	let count = 0;
	while ((findKey = findNextStart(arr, findMap))) {
		// 寻找到一个新的起点
		count = 0;
		const [i, j] = getIJByKey(findKey);
		resolveItem(arr, i, j, findMap, () => count++);
		if (count > maxLen) {
			maxLen = count;
		}
	}
	return maxLen;
}

function findNextStart(arr, findMap) {
	for (let i = 0, len = arr.length; i < len; i++) {
		const column = arr[i];
		for (let j = 0, jLen = column.length; j < jLen; j++) {
			const item = column[j];
			if (item === '1') {
				const key = getKey(i, j);
				if (findMap[key]) {
					// 已找过，则略过
				} else {
					return key;
				}
			}
		}
	}
}

// i 为列号， j为行号

function resolveItem(arr, i, j, map, cb) {
	if (typeof arr[i] === 'undefined' || typeof arr[i][j] === 'undefined') {
		// 不存在的点
		return;
	}
	const item = arr[i][j];
	const key = getKey(i, j);
	if (item === '1' && !map[key]) {
		// 一个新的通路
		map[key] = true;
		cb();
		// 寻找下个通路
		const left = {
			i: i - 1,
			j: j
		};
		const right = {
			i: i + 1,
			j: j
		};
		const top = {
			i: i,
			j: j - 1
		};
		const bottom = {
			i: i,
			j: j + 1
		};
		// 处理左边
		resolveItem(arr, left.i, left.j, map, cb);
		// 处理右边
		resolveItem(arr, right.i, right.j, map, cb);
		// 处理上边
		resolveItem(arr, top.i, top.j, map, cb);
		// 处理下边
		resolveItem(arr, bottom.i, bottom.j, map, cb);
	} else {
		// 已找过的点或关闭的点不考虑
	}
}

const str = (function() {
	let arr = [];
	for (let i = 0; i < 100; i++) {
		arr.push(Math.round(Math.random()));
	}
	return arr.join(' ');
})();

const testStr =
	'0 0 0 0 0 1 1 0 1 1 1 1 1 0 0 0 1 1 1 0 0 0 0 0 1 1 0 0 1 1 1 1 1 1 1 0 1 1 0 0 0 1 1 0 1 1 0 0 1 0 0 1 1 1 0 1 1 0 0 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 0 1 1 1 0 0 1 0 1 1 0 1 0 1 0 1 1 0 1 0 0 0 1 1 0 0';

const minStr = '0 1 0 1 0 0 1 0 0 0 0 1 1 0 0 0 0 1 0 1 0 0 0 0 1';
const strr =
	'0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 1 0 0 0 1 0 1 0 0 0 1 0 1 0 1 0 1 0 0 0 1 0 1 0 1 0 1 0 0 0 1 0 0 0 1 0 1 1 0 0 1 0 1 1 1 0 1 1 1 0 1 1 1 0 0 1 0 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 1 0 0 1 0 0 0';
console.time('1');
const res = test(strr);
console.log(res);
console.timeEnd('1');
