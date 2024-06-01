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
        <table className="min-w-full table-fixed rounded-md border border-gray-300"
               style={{
                   ...columnSizeVars, //Define column sizes on the <table> element
                   width: table.getTotalSize()
               }}>
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, idx) => (
                        <th key={header.id}
                            className="relative border-b-2 border-gray-300 bg-white px-6 py-3 text-lg tracking-wider font-semsibold"
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
                                    className: clsx("absolute inset-y-0 right-0 bg-gray-300 cursor-col-resize",
                                        header.column.getIsResizing() ? "bg-gray-500 w-[5px] rounded-lg inset-y-1 right-[2px]" : "border-solid border-x-4 border-white  w-[9px] ")
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
                <tr key={row.id} className="odd:bg-gray-100 even:bg-gray-200">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}
                            className="border-b border-gray-300 px-6 py-4 text-sm font-medium text-gray-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>

    );
};