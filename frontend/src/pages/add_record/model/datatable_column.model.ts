import { TableColumn } from 'react-data-table-component';
import { DataRow } from '../../../models/upload.model';

const columns: TableColumn<DataRow>[] = [
  {
    name: 'Title',
    selector: row => row.title,
  },
  {
    name: 'Issue Date',
    selector: row => row.issuedDate,
  },
  {
    name: 'Address',
    selector: row => row.address,
  },
  {
    name: 'Name',
    selector: row => row.name,
  },
  {
    name: 'Description',
    selector: row => row.description,
  },
  {
    name: 'Cid',
    selector: row => row.cid ?? 'Not generated',
  },
];

export default columns;
