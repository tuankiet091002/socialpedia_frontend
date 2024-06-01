import {Table} from "@tanstack/react-table";
import {MdFirstPage, MdLastPage} from "react-icons/md";

export type PaginateProps<Entry> = {
    table: Table<Entry>
}

export const Paginate = <Entry, >({table}: PaginateProps<Entry>) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <button
                className="flex items-center justify-center px-3 h-8 text-sm font-medium  bg-white border
                border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700
                dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <div className="flex flex-row items-center text-2xl"><MdFirstPage className="mr-1 inline"/></div>
                First
            </button>
            <button
                className="flex items-center justify-center px-3 h-8 text-sm font-medium  bg-white border
                border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700
                dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <svg className="rtl:rotate-180 w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M13 5H1m0 0 4 4M1 5l4-4"/>
                </svg>
                Previous
            </button>
            <button
                className="flex items-center justify-center px-3 h-8 text-sm font-medium  bg-white border
                border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700
                dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </button>
            <button
                className="flex items-center justify-center px-3 h-8 text-sm font-medium  bg-white border
                border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700
                dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                Last
                <div className="flex flex-row items-center text-2xl"><MdLastPage className="inline"/></div>
            </button>
            <span className="flex items-center gap-1">
                <div>Page</div>
                    <strong>
                    {table.getState().pagination.pageIndex + 1} of&nbsp;
                        {table.getPageCount() > 0 ? table.getPageCount() : 0}
                    </strong>
            </span>
            <span className="flex items-center gap-1">
                | Go to page:
                <input
                    type="number"
                    min="1"
                    max={table.getPageCount()}
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        table.setPageIndex(page)
                    }}
                    className="w-16 rounded border p-1 focus:outline-none"
                />
            </span>
            <select
                value={table.getState().pagination.pageSize}
                className="w-24 rounded border p-1 focus:outline-none"
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
            >
                {[2, 3, 4, 5].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        Display {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
}
