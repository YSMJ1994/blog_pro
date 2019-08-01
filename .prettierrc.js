module.exports = {
	// 折叠宽度
	printWidth: 120,
	// 一个缩进的空格数量
	tabWidth: 4,
	// 使用制表符代替空格缩进（制表符显示的长度在编辑器内设置）
	useTabs: true,
	// 行末分号
	semi: true,
	// 使用单引号
	singleQuote: true,
	// jsx中使用单引号
	jsxSingleQuote: false,
	// 尾随逗号 (none || es5 || all)
	trailingComma: 'none',
	// 对象大括号两端的空格
	bracketSpacing: true,
	// jax元素标签头部的 > 放在和属性的同一行(不适用于自闭合标签)
	jsxBracketSameLine: false,
	// 箭头函数参数的括号 (avoid 尽可能省略 || always 总是显示)
	arrowParens: 'avoid',
	// 格式文件的范围，以下为全部格式化
	rangeStart: 0,
	rangeEnd: Infinity,
	// 格式器 (自动推断)
	// parser: '',
	/* 启动编译的注释指示 (启动后只有文件头部添加了如下注释才会进行格式化) 
		@prettier
		@format
	*/
	requirePragma: false,
	// 自动为文件头部添加启动格式化注释, 通常配合requirePragma使用
	insertPragma: false,
	// markdown包装 (always || never || preserve)
	proseWrap: 'never',
	// html空格敏感 (css 遵循display默认值 || strict 敏感 || ignore 不敏感)
	htmlWhitespaceSensitivity: 'css',
	// 行末换行符 (auto 根据系统自动识别 || lf 换行|| crlf 回车换行|| cr 回车)
	endOfLine: 'auto',
	// 分类调整格式
	overrides: [
		{
			files: ['*.json'],
			options: {
				parser: 'json',
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};
