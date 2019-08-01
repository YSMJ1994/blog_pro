import axios from 'axios';

const service = axios.create({
	timeout: 10000
});

// service.interceptors.request.use()
service.interceptors.response.use(
	response => {
		const { status, data, config } = response;
		if (status === 200) {
			return Promise.resolve(data);
		} else {
			return Promise.reject(data);
		}
	},
	error => {
		console.log('response error', error);
	}
);

export default service;
