import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

import { TableColumn } from 'react-data-table-component';

type DataRow = {
  title: string;
  issuedDate: string;
  address: string;
  name: string;
  description: string;
};

const ExcelUploader = () => {
  const [data, setData] = useState<DataRow[]>([]);

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
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const binaryStr = e.target?.result;
        if (binaryStr) {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const formattedData: DataRow[] = jsonData.map((row: any, _) => {
            console.log(row['Title']);
            return {
              title: row['Title'],
              issuedDate: row['Issue Date'],
              address: row['Address'],
              name: row['Name'],
              description: row['Description'],
            };
          });

          console.log(jsonData);
          setData(formattedData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre>
      <DataTable columns={columns} data={data}  /> */}
    </div>
  );
};

export default ExcelUploader;
