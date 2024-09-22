import { ChangeEvent, useState } from 'react';
import PageTitle from '../../shared/components/page_title';

import * as XLSX from 'xlsx';

import { DataRow } from '../../models/upload.model';
import DataTable, { TableColumn } from 'react-data-table-component';

import { PinataSDK } from 'pinata-web3';

enum FormType {
  SINGLE,
  MULTIPLE,
}

const pinata = new PinataSDK({
  pinataJwt: process.env.VITE_PINATA_JWT ?? '',
  pinataGateway: process.env.VITE_GATEWAY_URL ?? '',
});

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

export default function AddRecord() {
  const [formType, setFormType] = useState<FormType>(FormType.SINGLE);
  const [data, setData] = useState<DataRow[]>([]);

  PageTitle('Add Record');

  const uploadPinata = async () => {
    try {
      const file = new File(['hello'], 'Testing.txt', { type: 'text/plain' });
      const upload = await pinata.upload.file(file);
      console.log(upload);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadJsonPinata = async () => {
    try {
      const fileArray = data.map((row, index) => {
        const jsonData = JSON.stringify(row);
        return new File([jsonData], `data_${row.address}.json`, {
          type: 'application/json',
        });
      });

      const uploads = await pinata.upload.fileArray(fileArray);

      console.log(uploads);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-slate-800 h-screen w-full flex justify-center items-center">
        <div className="w-1/2">
          <div className="h-auto w-full mx-1 sm:w-auto xl:w-auto sm:p-5 rounded-md shadow-lg bg-white">
            <div className="space-y-6">
              <div className="flex-col m-2 sm:m-0">
                <p className="font-medium mb-2">Form Type</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = e => {
                      const binaryStr = e.target?.result;
                      if (binaryStr) {
                        const workbook = XLSX.read(binaryStr, {
                          type: 'binary',
                        });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(sheet);

                        const formattedData: DataRow[] = jsonData.map(
                          (row: any, _) => {
                            console.log(row['Title']);
                            return {
                              title: row['Title'],
                              issuedDate: row['Issue Date'],
                              address: row['Address'],
                              name: row['Name'],
                              description: row['Description'],
                            };
                          }
                        );
                        setData(formattedData);
                      }
                    };
                    reader.readAsArrayBuffer(file);
                  }
                }}
              />
              <a
                href="../../../public/template/upload_record_template.xlsx"
                download
                className="text-blue-500 text-right underline"
              >
                Download template
              </a>
              <button
                className="text-white text-center  rounded-md bg-slate-900 py-3 w-1/2 hover:bg-opacity-70"
                onClick={uploadJsonPinata}
              >
                Submit
              </button>
              <div className="h-96, overflow-auto">
                <DataTable columns={columns} data={data} pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
