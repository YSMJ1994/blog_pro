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
				libraryName: 'sober_components',
				camel2DashComponentName: false,
				libraryDirectory: 'es',
				style: 'css'
			},
			'import-for-sober_components'
		]
	]
};
