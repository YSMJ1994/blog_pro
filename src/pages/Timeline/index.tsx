import React, { FC } from 'react';
import cs from 'classnames';
import PageTitle from '@/components/PageTitle';

const Timeline: FC<{ className: string }> = ({ className }) => {
	return (
		<div className={cs(className)}>
			<PageTitle title="归档" icon="timeline" />
		</div>
	);
};

export default Timeline;
