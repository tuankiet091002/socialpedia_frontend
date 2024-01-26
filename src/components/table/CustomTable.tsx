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
                    {headerGroup.headers.map((header, idx) => (
                        <th key={header.id}
                            className="relative px-6 py-3 font-sans font-semibold tracking-wider "
                            style={{width: `calc(var(--header-${header?.id}-size) * 1px)`}}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            {idx != headerGroup.headers.length - 1 && <div
                                {...{
                                    onDoubleClick: () => header.column.resetSize(),
                                    onMouseDown: header.getResizeHandler(),
                                    onTouchStart: header.getResizeHandler(),
                                    className: clsx("absolute inset-y-0 right-0 w-[2px] bg-gray-300 cursor-col-resize",
                                        header.column.getIsResizing() && "bg-gray-500")
                                }}
                            >
                            </div>}
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