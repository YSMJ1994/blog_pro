import fetch from '@/utils/fetch';

export function access_log() {
	return fetch.get<number>('/blog_server/blog_access');
}

export interface BlogInfo {
	access_num: number;
	runtime: number;
}

export function getBlogInfo() {
	return fetch.get<BlogInfo>('/blog_server/blog_info');
}
