const HighLight = require('highlight.js');
const config = {
	html: true,
	linkify: false,
	typographer: true,
	highlight: function(str, lang) {
		if (lang && HighLight.getLanguage(lang)) {
			try {
				return HighLight.highlight(lang, str.replace(/\t/g, '    ')).value;
			} catch (__) {}
		}
		return '';
	}
};

module.exports = config;
