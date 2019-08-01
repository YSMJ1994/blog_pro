import React, { useContext, useState } from 'react';
import DocCtx from '@/ctx/DocCtx';

function Home() {
	const docInfo = useContext(DocCtx);
	console.log('docInfo', docInfo);
	const { articles } = docInfo;
	return (
		<div style={{ height: '1200px' }}>
			<h1>home</h1>
			<ul>
				{articles.map((doc, i) => {
					const { title, content } = doc;
					return <li key={title + `_${i}`} dangerouslySetInnerHTML={{ __html: content }} />;
				})}
			</ul>
		</div>
	);
}

export default Home;
