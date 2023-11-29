import * as React from 'react';

type TableColumn<Entry> = {
    title: string;
    field: keyof Entry;
    Cell?({entry}: { entry: Entry }): React.ReactElement;
};

export type TableProps<Entry> = {
    data: Entry[];
    columns: TableColumn<Entry>[];
};

export const Table = <Entry extends { id: number }>({data, columns}: TableProps<Entry>) => {
    if (!data?.length) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <h4>No Entries Found</h4>
            </div>
        );
    }
    return (
        <table className="table table-striped table-bordered">
            <thead className="bg-gray-50">
            <tr>
                {columns.map((column, index) => (
                    <th key={column.title + index} scope="col">
                        {column.title}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((entry) => (
                <tr key={entry?.id}>
                    {columns.map(({Cell, field, title}, columnIndex) => (
                        <td key={title + (entry?.id || columnIndex)}>
                            {Cell ? <Cell entry={entry}/> : entry[field] as string}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>

    );
};