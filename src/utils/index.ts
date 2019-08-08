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
