interface cacheObject<T> {
	data: T;
	timestamp: number;
	outDateTime: number;
}

export function get<T>(key: string): T | null {
	if (!key) {
		return null;
	}
	const cache: string | null = localStorage.getItem(key);
	if (!cache) {
		return null;
	} else {
		try {
			let { data, timestamp, outDateTime } = <cacheObject<T>>JSON.parse(cache);
			if (outDateTime) {
				// 存在过期时间
				const now = +new Date();
				if (now - timestamp > outDateTime) {
					// 过期了
					// 清除缓存，返回空值
					clear(key);
					return null;
				} else {
					// 没过期
					return data;
				}
			} else {
				// 无过期时间
				return data;
			}
		} catch (e) {
			return null;
		}
	}
}

export function set(key: string, value: any, duration: number = 0): boolean {
	if (!key) {
		return false;
	}
	const cacheObj: cacheObject<typeof value> = {
		data: value,
		timestamp: +new Date(),
		outDateTime: duration
	};
	try {
		localStorage.setItem(key, JSON.stringify(cacheObj));
		return true;
	} catch (e) {
		return false;
	}
}

export function clear(key?: string) {
	if (key) {
		localStorage.setItem(key, '');
	} else {
		localStorage.clear();
	}
}

export default {
	get,
	set,
	clear
};
