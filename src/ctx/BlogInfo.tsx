import React, { FC, useEffect, useState } from 'react';
import { getBlogInfo, BlogInfo } from '@/api/blogInfo';

const initInfo: BlogInfo = {
	access_num: 0,
	runtime: 0
};
const BlogInfoCtx = React.createContext<BlogInfo>(initInfo);

export const Provider: FC = ({ children }) => {
	const [info, setInfo] = useState<BlogInfo>(initInfo);
	useEffect(() => {
		getBlogInfo().then(result => {
			setInfo(result);
		});
	}, []);
	return <BlogInfoCtx.Provider value={info}>{children}</BlogInfoCtx.Provider>;
};

export default BlogInfoCtx;
