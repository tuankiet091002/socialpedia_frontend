import {flexRender, Table} from "@tanstack/react-table";
import {useMemo} from "react";
import clsx from "clsx";

type TableProps<Entry> = {
    table: Table<Entry>;
};

export const CustomTable = <Entry extends object>({table}: TableProps<Entry>) => {
    const columnSizeVars = useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: { [key: string]: number } = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]!;
            colSizes[`--header-${header.id}-size`] = header.getSize();
            colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
        }
        return colSizes;
    }, [table.getState().columnSizingInfo]);

    return (
        <table className="min-w-full table-fixed divide-x divide-gray-200"
               style={{
                   ...columnSizeVars, //Define column sizes on the <table> element
                   width: table.getTotalSize()
               }}>
            <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}
                            className="relative px-6 py-3 tracking-wider font-semibold font-sans"
                            style={{width: `calc(var(--header-${header?.id}-size) * 1px)`}}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            <div
                                {...{
                                    onDoubleClick: () => header.column.resetSize(),
                                    onMouseDown: header.getResizeHandler(),
                                    onTouchStart: header.getResizeHandler(),
                                    className: clsx("absolute top-0 h-full right-0 w-1 bg-gray-400 cursor-col-resize hover:bg-gray-500",
                                        header.column.getIsResizing() && "bg-gray-500")
                                }}
                            >
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="odd:bg-white even:bg-gray-100">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}
                            className="border border-gray-300 px-6 py-4 text-sm font-medium text-gray-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>

    );
};