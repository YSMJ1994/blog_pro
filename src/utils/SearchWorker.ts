import { DocInfo, Group, MdDoc, Tag } from '@/ctx/DocCtx';

export interface SearchTag {
	name: string;
	match: string;
}
export interface SearchGroup {
	name: string;
	match: string;
}

export interface SearchArticle {
	id: number;
	title: string;
	match: string;
}

export interface SearchResult {
	tags: SearchTag[];
	groups: SearchGroup[];
	articles: SearchArticle[];
}

const getWorker = (function() {
	// 搜索脚本的路径
	const scriptUrl = 'js/searchWorker.js';
	// worker实例
	let worker: Worker | undefined;
	// worker状态： 1为空闲，0为繁忙或不可用
	let workerStatus: 0 | 1 = 0;
	// 上次任务的reject
	let latestReject: ((reason?: any) => any) | undefined;

	return () => {
		// 未初始化或繁忙，则重置worker
		if (!worker || !workerStatus) {
			// 上次任务reject
			latestReject && latestReject('有新的搜索任务');
			// 销毁线程
			worker && worker.terminate();
			// 初始化worker
			worker = new Worker(scriptUrl);
			// 初始化状态
			workerStatus = 1;
		}
		return {
			worker,
			status: workerStatus,
			setStatus(status: 0 | 1) {
				workerStatus = status;
			},
			setReject(reject: (reason?: any) => any) {
				latestReject = reject;
			}
		};
	};
})();

export default function SearchWorker(keyword: string, docInfo: DocInfo) {
	return new Promise<SearchResult>((resolve, reject) => {
		const { worker, setStatus, setReject } = getWorker();
		// 设置为繁忙
		setStatus(0);
		// 5s秒后超时
		let timeout = setTimeout(() => {
			reject('timeout');
			// 释放资源
			worker && worker.terminate();
		}, 5000);
		// 监听消息
		worker.onmessage = function(this: Worker, ev: MessageEvent) {
			clearTimeout(timeout);
			resolve(ev.data);
			setStatus(1);
		};
		// 记录reject
		setReject(reject);
		// 发送消息
		worker.postMessage({ keyword, docInfo });
	});
}
