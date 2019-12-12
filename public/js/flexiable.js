(function(global, factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory());
	} else if (typeof define === 'function' && define.cmd) {
		define(function(require, exports, module) {
			module.exports = factory();
		});
	} else {
		global.flexiable = factory();
	}
})(this, function() {
	function isMobile() {
		return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
	}
	function execute(rem = 16, designWidth = document.documentElement.clientWidth) {
		const dpr = window.devicePixelRatio || 1;
		const clientWidth = document.documentElement.clientWidth;
		const width = clientWidth * dpr;
		const scale = 1 / dpr;
		const remCalc = (rem * width) / designWidth;
		let viewport = document.querySelector('meta[name="viewport"]');
		if (!viewport) {
			viewport = document.createElement('meta');
			viewport.setAttribute('name', 'viewport');
			document.head.insertAdjacentElement('afterbegin', viewport);
		}
		viewport.setAttribute(
			'content',
			`width=${width}, user-scalable=no, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`
		);
		document.head.insertAdjacentHTML('beforeend', `<style>html { font-size: ${remCalc}px!important; }</style>`);
		window.addEventListener('load', function () {
			document.body.setAttribute('data-mobile', 'data-mobile');
			document.body.setAttribute('data-dpr', dpr);
		})
	}
	return function(rem, designWidth) {
		if (isMobile()) {
			execute(rem, designWidth);
		}
	};
});
