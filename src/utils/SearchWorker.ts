import { DocInfo, Group, MdDoc, Tag } from '@/ctx/DocCtx';
let worker: Worker | undefined;

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

export default function SearchWorker(keyword: string, docInfo: DocInfo) {
	return new Promise<SearchResult>((resolve, reject) => {
		if (!worker) {
			worker = new Worker('js/searchWorker.js');
		}
		// 2s秒后销毁线程，搜索失败
		setTimeout(() => {
			worker && worker.terminate();
			worker = undefined;
			reject('timeout');
		}, 2000);
		worker.onmessage = function(this: Worker, ev: MessageEvent) {
			resolve(ev.data);
		};
		worker.postMessage({ keyword, docInfo });
	});
}
