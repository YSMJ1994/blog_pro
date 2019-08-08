import fetch from '@/utils/fetch';

export const defaultInfo = {
	login: '',
	id: 0,
	node_id: '',
	avatar_url: '',
	gravatar_id: '',
	url: '',
	html_url: '',
	followers_url: '',
	following_url: '',
	gists_url: '',
	starred_url: '',
	subscriptions_url: '',
	organizations_url: '',
	repos_url: '',
	events_url: '',
	received_events_url: '',
	type: '',
	site_admin: false,
	name: 'SoberZ',
	company: null,
	blog: '',
	location: '',
	email: '',
	hireable: null,
	bio: '',
	public_repos: 0,
	public_gists: 0,
	followers: 0,
	following: 0,
	created_at: '',
	updated_at: '',
	private_gists: 0,
	total_private_repos: 0,
	owned_private_repos: 0,
	disk_usage: 0,
	collaborators: 0,
	two_factor_authentication: false,
	plan: {
		name: '',
		space: 0,
		collaborators: 0,
		private_repos: 0
	}
};

export type InfoType = typeof defaultInfo;

export function getInfo() {
	return fetch.get<any, InfoType>('https://api.github.com/user', {
		params: {
			access_token: process.env.GITHUB_TOKEN
		}
	});
}
