import React from 'react';
import * as XLSX from 'xlsx';

export const ExcelReader = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  let data: unknown[] = [];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const binaryStr = e.target?.result;
      if (binaryStr) {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        data.push(jsonData);
        // const formattedData: DataRow[] = jsonData.map((row: any, _) => {
        //   console.log(row['Title']);
        //   return {
        //     title: row['Title'],
        //     issuedDate: row['Issue Date'],
        //     address: row['Address'],
        //     name: row['Name'],
        //     description: row['Description'],
        //   };
        // });

        console.log(jsonData);
      }
    };
    reader.readAsArrayBuffer(file);

    return data;
  }
};
