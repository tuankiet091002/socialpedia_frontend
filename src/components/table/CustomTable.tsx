import {flexRender, Table} from "@tanstack/react-table";
import {useMemo} from "react";

type TableProps<Entry> = {
    table: Table<Entry>;
};

export const CustomTable = <Entry extends object>({table}: TableProps<Entry>) => {
    const columnSizeVars = useMemo(() => {
        const headers = table.getFlatHeaders()
        const colSizes: { [key: string]: number } = {}
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]!
            colSizes[`--header-${header.id}-size`] = header.getSize()
            colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
        }
        return colSizes
    }, [table.getState().columnSizingInfo])

    return (
        <table style={{
            ...columnSizeVars, //Define column sizes on the <table> element
            width: table.getTotalSize(),
        }}>
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} style={{
                            width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        }}>
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
                                    className: `resizer ${
                                        header.column.getIsResizing() ? 'isResizing' : ''
                                    }`,
                                }}
                            >abc
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>

    );
};