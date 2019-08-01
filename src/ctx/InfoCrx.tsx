import React, { FC, useEffect, useState } from 'react';
import { getInfo, defaultInfo, InfoType } from '@/api/github';
import { get, set } from 'utils/localCache';

const cacheKey = '__github_info';
const cacheInfo = get<InfoType>(cacheKey);
const initInfo = cacheInfo || defaultInfo;
const InfoCtx = React.createContext<InfoType>(initInfo);

export const Provider: FC = ({ children }) => {
	const [info, setInfo] = useState<InfoType>(initInfo);
	useEffect(() => {
		getInfo().then(result => {
			if (result) {
				set(cacheKey, result);
				setInfo(result);
			}
		});
	}, []);
	return <InfoCtx.Provider value={info}>{children}</InfoCtx.Provider>;
};

export default InfoCtx;
