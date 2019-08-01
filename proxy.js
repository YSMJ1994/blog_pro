const proxy = require('http-proxy-middleware')

module.exports = function(app) {
	app.use(
		proxy(process.env.BASE_API, {
			target: process.env.PROXY_PATH,
			changeOrigin: true,
			pathRewrite: {
				[`^${process.env.BASE_API}`]: ''
			}
		})
	);
};
