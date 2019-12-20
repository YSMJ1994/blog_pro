import React, { FC, useEffect, useState } from 'react';
import { getInfo, defaultInfo, InfoType } from '@/api/github';
import { localCache } from '@ysmj/web_utils';

const cacheKey = '__github_info';
const cacheInfo = localCache.get<InfoType>(cacheKey);
const initInfo = cacheInfo || defaultInfo;
const InfoCtx = React.createContext<InfoType>(initInfo);

export const Provider: FC = ({ children }) => {
	const [info, setInfo] = useState<InfoType>(initInfo);
	useEffect(() => {
		getInfo().then(result => {
			if (result) {
				localCache.set(cacheKey, result);
				// console.log('request github info', result);
				setInfo(result);
			}
		});
	}, []);
	return <InfoCtx.Provider value={info}>{children}</InfoCtx.Provider>;
};

export default InfoCtx;
