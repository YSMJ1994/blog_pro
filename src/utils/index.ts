import moment, { Moment } from 'moment';

export function getType(target: any): string {
	const typeofType = typeof target;
	if (typeofType === 'object') {
		if (target === null) {
			return 'null';
		} else {
			return Object.prototype.toString
				.call(target)
				.replace(/^\[object\s(.*)]$/, '$1')
				.toLowerCase();
		}
	} else {
		return typeofType;
	}
}

export type Time = string | number | Date | Moment | undefined;
export function formatTime(time: Time = +moment(), format = 'YYYY-MM-DD HH:mm:ss') {
	return moment(time).format(format);
}

export function* ObjectIterator(obj: any) {
	const keys = Object.keys(obj).sort((a, b) => (a > b ? 1 : -1));
	for (let i = 0, len = keys.length; i < len; i++) {
		yield obj[keys[i]];
	}
}

export function isMobile(): boolean {
	return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
}
