import { TableColumn } from 'react-data-table-component';

type DataTableProps = {
  columns: TableColumn<any>[];
  data: any[];
};

export default function DataTable({ columns, data }: DataTableProps) {
  return <DataTable columns={columns} data={data} />;
}
