import { ChangeEvent, useEffect, useState } from 'react';
import PageTitle from '../../shared/components/page_title';
import { ethers } from 'ethers';
import { web3ErrorHanlder } from '../../shared/helper/errorHandler';
import { connectWallet } from '../../shared/helper/wallet';
import AcademicRecordContract from '../../contracts/academicrecord.json';
import * as XLSX from 'xlsx';

import { DataRow } from '../../models/upload.model';
import DataTable from 'react-data-table-component';

import { PinataSDK } from 'pinata-web3';
import columns from './model/datatable_column.model';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import {
  RecordItemModel,
  RecordModel,
} from '../../models/add-record/ipfs_record.model';
import { CustomToast, ToastType } from '../../shared/components/toast';

const pinata = new PinataSDK({
  pinataJwt: process.env.VITE_PINATA_JWT ?? '',
  pinataGateway: process.env.VITE_GATEWAY_URL ?? '',
});

export default function AddRecord() {
  const [data, setData] = useState<DataRow[]>([]);
  const [address, setAddress] = useState('');
  const contractAddress = process.env.ACADEMIC_RECORD_CONTRACT_ADDRESS ?? '';
  const contractABI = AcademicRecordContract.abi;

  PageTitle('Add Record');

  const handleWalletConnection = async () => {};
  connectWallet({
    onSuccess(address, signer) {
      setAddress(address);
      signer = signer;
    },
    onError(error) {
      CustomToast({ type: ToastType.ERROR, title: error.message });
    },
  });

  useEffect(() => {
    handleWalletConnection();

    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAddress(value => {
          value = accounts[0];
          return value;
        });
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.off(
          'accountsChanged',
          function (accounts: string[]) {}
        );
      }
    };
  }, [address]);

  const uploadPinata = async () => {
    try {
      const file = new File(['hello'], 'Testing.txt', { type: 'text/plain' });
      const upload = await pinata.upload.file(file);
      console.log(upload);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToIPFS = async () => {
    let fileNames: string[] = [];
    try {
      const {
        proofs: treeResult,
        root: root,
      }: { proofs: RecordModel[]; root: string } = generateMerkleTree();
      const fileArray = treeResult.map((row, _) => {
        const jsonData = JSON.stringify(row);
        const fileName = `${row.data.address}_${Date.now()}`;
        fileNames.push(fileName);
        return new File([jsonData], `data_${fileName}.json`, {
          type: 'application/json',
        });
      });

      // 1. generate merkle tree
      // 2. upload to ipfs with pinata
      // 3. generate user credential
      const uploads = await pinata.upload.fileArray(fileArray, {
        metadata: {
          name: `${Date.now()}_record`,
        },
      });
      const cid = uploads.IpfsHash;
      const salt = 'r3c0rd-m@nag3mentt012';
      fileNames.forEach((fileName, _) => {
        const credential = buildCredential(cid, fileName, salt);
        console.log(credential);
      });

      // await handleIssueToBlockchain(root);
      console.log(uploads);
    } catch (error) {
      console.log(error);
    }
  };

  const generateMerkleTree = () => {
    let temp_data: RecordItemModel[] = data.map(row => {
      return {
        title: row.title,
        issueDate: row.issuedDate,
        address: row.address,
        issuerAddress: '0xxx',
        description: row.description,
        name: row.name,
      };
    });

    const leaves = data.map(row => [
      row.address,
      row.title,
      row.name,
      row.description,
      row.issuedDate,
    ]);

    const tree = StandardMerkleTree.of(leaves, [
      'string',
      'string',
      'string',
      'string',
      'string',
    ]);
    const root = tree.root.toString();
    const proofs: RecordModel[] = leaves.map((_, index) => {
      const proof = tree.getProof(index);
      return {
        data: temp_data[index],
        proof: proof,
        tree_index: index,
        root: tree.root,
      };
    });

    return { proofs, root };
  };

  const handleIssueToBlockchain = async (root: string) => {
    try {
      if (!address) {
        throw new Error('Please connect your wallet');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await contract.AddRecord(root);
      await tx.wait();
      await CustomToast({
        type: ToastType.SUCCESS,
        title: 'Record registered successfully',
      });
      setData([]);
    } catch (err: any) {
      // throw web3ErrorHanlder(err.info.error);
      await CustomToast({ type: ToastType.ERROR, title: err });
    }
  };

  const generateUserCredential = () => {
    // credential cid|filename|salt
  };

  function buildCredential(cid: string, filename: string, salt: string) {
    // Combine the inputs in the specified format
    const combinedInput = `${cid}|${filename}|${salt}`;

    // Encode the combined input in Base64
    const base64Credential = btoa(combinedInput);
    return base64Credential;
  }

  function decodeSecureCredential(base64Credential: string) {
    try {
      // Decode the Base64 string
      const decodedInput = atob(base64Credential);
      const [cid, filename, salt] = decodedInput.split('|');

      // Return the original components
      return { cid, filename, salt };
    } catch (error) {
      return null; // Return null if decoding fails
    }
  }

  const validate = () => {
    const isValid = StandardMerkleTree.verify(
      '0x7b7d63453bf0a52c7745d0613592cd5e91ec3cf51c948ffc041af296531b5700',
      ['string', 'string', 'string', 'string', 'string'],
      [
        '0xAf4B2d2B7Db6F9b7aC4F8B1D9A2BdF5c87B28D8c',
        'Tokenomics',
        'Test15',
        'Design of cryptocurrency economics',
        45553,
      ],
      [
        '0xfd351d65ecfe3ece2ef6f87f04f1463fef35deb177eafced8804b2a98dcc6a5b',
        '0x7654e0687a1a55bf032e014a39c4961c2e1733c28aeb8c527c11fdc752dd5c32',
        '0xb4247a3634a0ab1bf9968cda27d106dd4fc018c3906ae23445335dd233e33f56',
        '0x9e376bed931e1e348c1cbec5f5aa3ae2bf38712bbf251f06aae62c8a85d26f23',
      ]
    );

    console.log('isvalid: ', isValid);
  };

  const fetchEvents = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    // Set up the filter for the RecordIssued event
    const filter = contract.filters.RecordIssued();

    // Fetch the logs
    const logs = await provider.getLogs({
      ...filter,
      fromBlock: 0, // Adjust the block range as needed
      toBlock: 'latest',
    });

    // Parse the logs
    const parsedEvents = logs.map(log => {
      const parsedLog = contract.interface.parseLog(log);
      return {
        issuerAddress: parsedLog?.args._issuerAddress,
        txHash: parsedLog?.args._txHash,
      };
    });
    console.log(parsedEvents);
  };

  const decodeCred = () => {
    console.log(
      decodeSecureCredential(
        'YmFmeWJlaWY1cXRkeWRjY3p2dXV3bmhkNTQ3YWxidXdwb2U3dnl5NmIzd3Q1dW12c2l0eGt1ZWh6cWl8MHhBMWIyRDNjNEU1ZjY3ODlBMUIyQzNENGU1RjY3ODlhQjJDM0Q0ZTVfMTcyNzE4ODkzNjA0NXxyM2MwcmQtbUBuYWczbWVudHQwMTI='
      )
    );
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
                onClick={uploadToIPFS}
              >
                Submit
              </button>
              <button
                className="text-white text-center  rounded-md bg-slate-900 py-3 w-1/2 hover:bg-opacity-70"
                onClick={fetchEvents}
              >
                get events
              </button>

              <button
                className="text-white text-center  rounded-md bg-slate-900 py-3 w-1/2 hover:bg-opacity-70"
                onClick={decodeCred}
              >
                deccode cred
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
