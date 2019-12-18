import fetch from '@/utils/fetch';

export function access_log() {
	return fetch({
		url: '/blog_server/blog_access',
		method: 'get'
	});
}
