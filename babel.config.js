module.exports = {
	presets: ['react-app'],
	plugins: [
		[
			'import',
			{
				libraryName: 'antd',
				libraryDirectory: 'es',
				style: 'css'
			},
			'import-for-antd'
		],
		[
			'import',
			{
				libraryName: '@ysmj/react-ui',
				camel2DashComponentName: false,
				libraryDirectory: 'es',
				style: 'css'
			},
			'import-for-@ysmj/react-ui'
		]
	]
};
