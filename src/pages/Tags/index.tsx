import React, { FC } from 'react';
import { Route, withRouter, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import Overview from './Overview';
import TagDetail from './Detail';
import styles from './style.module.scss';
import Title from '../../components/Link';
import cs from 'classnames';

const Tags: FC<{ className?: string } & RouteComponentProps<any>> = ({ className, match: { path } }) => {
	return (
		<div className={cs(styles.tagsWrap, className)}>
			<Switch>
				<Route exact path={path} component={Overview} />
				<Route exact path={`${path}/:name`} component={TagDetail} />
			</Switch>
		</div>
	);
};

export default withRouter(Tags);
