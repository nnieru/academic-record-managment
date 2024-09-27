import { TableColumn } from 'react-data-table-component';
import { DataRow } from '../../../models/upload.model';
import { CustomToast, ToastType } from '../../../shared/components/toast';

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
  {
    name: 'Action',
    cell: row => (
      <button onClick={() => copyToClipboard(row.cid?.toString() ?? '')}>
        copy
      </button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const copyToClipboard = async (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(async () => {
      if (text.length < 1) {
        await CustomToast({ type: ToastType.ERROR, title: 'No cid To Copy' });
        return;
      }
      await CustomToast({ type: ToastType.SUCCESS, title: `Copied: ${text}` });
    })
    .catch(async err => {
      await CustomToast({ type: ToastType.ERROR, title: err });
      console.error('Failed to copy text: ', err);
    });
};

export default columns;
