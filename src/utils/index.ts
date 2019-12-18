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

export function UUID(): string {
	let s = [];
	let hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';
	s[19] = hexDigits.substr((Number(s[19]) & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = '';
	return s.join('');
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
