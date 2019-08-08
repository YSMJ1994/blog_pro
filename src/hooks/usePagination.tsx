import React, { FC, useEffect, useState } from 'react';
import DefaultPagination from '@/components/Pagination';

interface PaginationProps {
	current: number;
	pageSize: number;
	total: number;
	onChange?: (current: number, pageSize?: number) => any;
}

export default function usePagination<T>(
	list: T[],
	pageSize: number,
	Pagination: FC<PaginationProps> = DefaultPagination
): [T[], number, FC] {
	const total = list.length;
	const [page, setPage] = useState<number>(1);
	const [pagingList, setPagingList] = useState<T[]>([]);
	const PageComp: FC = () => {
		return <Pagination current={page} total={total} onChange={nextPage => setPage(nextPage)} pageSize={pageSize} />;
	};
	useEffect(() => {
		setPagingList(list.slice((page - 1) * pageSize, page * pageSize));
	}, [list, total, pageSize, page]);
	return [pagingList, page, PageComp];
}
