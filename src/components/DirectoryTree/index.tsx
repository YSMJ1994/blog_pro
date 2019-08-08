import React, { FC } from 'react';
import styles from './style.module.scss';

interface TreeItem {
	name: string;
	selected?: boolean;
	children?: TreeItem[];
}
interface DirectoryTreeProps {
	tree: TreeItem[];
}
const DirectoryTree: FC<DirectoryTreeProps> = () => {
	return <div />;
};

export default DirectoryTree;
