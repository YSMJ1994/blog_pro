export function load() {
	const linkId = '__load_icon';

	let iconLink: HTMLLinkElement | null = document.querySelector(`#${linkId}`);
	if (iconLink) {
		document.head.removeChild(iconLink);
	}
	iconLink = document.createElement('link');
	iconLink.id = linkId;
	iconLink.rel = 'stylesheet';
	iconLink.href = process.env.ICON_URL || '';
	document.head.appendChild(iconLink);
}

export default {
	load
};
