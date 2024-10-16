import { ChangeEvent, useEffect, useState } from 'react';
import PageTitle from '../../shared/components/page_title';
import { ethers } from 'ethers';
import { web3ErrorHanlder } from '../../shared/helper/errorHandler';
import { connectWallet } from '../../shared/helper/wallet';
import AcademicRecordContract from '../../contracts/academicrecordv2.json';
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

  const uploadToIPFS = async () => {
    // Start timing
    const startAllFunction = Date.now();
    let fileNames: string[] = [];
    try {
      const {
        proofs: treeResult,
        root,
      }: { proofs: RecordModel[]; root: string } = generateMerkleTree();
      const fileArray = treeResult.map((row, _) => {
        const jsonData = JSON.stringify(row);
        const fileName = `${row.data.address}_${Date.now()}`;
        fileNames.push(fileName);
        return new File([jsonData], `data_${fileName}.json`, {
          type: 'application/json',
        });
      });
      await handleIssueToBlockchain(root);
      const startTimeIPFSupload = Date.now();
      const uploads = await pinata.upload.fileArray(fileArray, {
        metadata: {
          name: `${Date.now()}_record`,
        },
      });
      const cid = uploads.IpfsHash;
      const endTimeIPFSupload = Date.now();

      const uploadTime = (endTimeIPFSupload - startTimeIPFSupload) / 1000; // Convert to seconds
      console.log(`ipfs time: ${uploadTime} seconds`);

      // Update data state with the generated cid
      const salt = 'r3c0rd-m@nag3mentt012';
      const updatedData = data.map((row, index) => {
        const fileName = fileNames[index];
        const credential = buildCredential(cid, fileName, salt);
        return {
          ...row,
          cid: credential, // Assign the credential to the cid field
        };
      });
      setData(updatedData); // Update the state with the new data including cid
    } catch (error) {
      console.log('err:', error);
    }

    const endAllFunction = Date.now();
    const allfucntionTIme = (endAllFunction - startAllFunction) / 1000; // Convert to seconds
    console.log(`Upload time: ${allfucntionTIme} seconds`);
  };

  const generateMerkleTree = () => {
    const startTime = Date.now();
    let temp_data: RecordItemModel[] = data.map(row => {
      return {
        title: row.title,
        issueDate: row.issuedDate,
        address: row.address,
        issuerAddress: address,
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
    const endTime = Date.now();
    const genreateMerkleTreeTime = (endTime - startTime) / 1000; // Convert to seconds
    console.log(`merkle tree time: ${genreateMerkleTreeTime} seconds`);

    return { proofs, root };
  };

  const handleIssueToBlockchain = async (root: string) => {
    const startDate = Date.now();
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
      await CustomToast({ type: ToastType.ERROR, title: err });
      throw new Error(err);
    }
    const endDate = Date.now();
    const issueToBlockchainTime = (endDate - startDate) / 1000; // Convert to seconds
    console.log(`issue to blockchain time: ${issueToBlockchainTime} seconds`);
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
    <div className="bg-slate-800 h-screen flex justify-center items-center overflow-auto">
      <div className="w-1/2 space-y-4">
        {/* Card for file input and actions */}
        <div className="p-6 bg-white rounded-md shadow-lg space-y-4">
          <div>
            <p className="font-medium text-lg mb-4">Upload Record</p>
            <input
              className="block w-full p-2 border border-gray-300 rounded-md"
              type="file"
              accept=".xlsx, .xls"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
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

                      const formattedData: DataRow[] = jsonData.map(
                        (row: any) => ({
                          title: row['Title'],
                          issuedDate: row['Issue Date'],
                          address: row['Address'],
                          name: row['Name'],
                          description: row['Description'],
                        })
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
              className="text-blue-500 mt-2 text-sm underline block"
            >
              Download template
            </a>
          </div>

          <div className="flex justify-between">
            <button
              className="w-1/3 text-white bg-slate-900 py-2 rounded-md hover:bg-opacity-70"
              onClick={uploadToIPFS}
            >
              Submit
            </button>

            <button
              className="w-1/3 text-white bg-slate-900 py-2 rounded-md hover:bg-opacity-70"
              onClick={fetchEvents}
            >
              Get Events
            </button>

            <button
              className="w-1/3 text-white bg-slate-900 py-2 rounded-md hover:bg-opacity-70"
              onClick={decodeCred}
            >
              Decode Cred
            </button>
          </div>
        </div>

        {/* Card for displaying data */}
        <div
          className="p-6 bg-white rounded-md shadow-lg"
          style={{ minWidth: '50%' }}
        >
          <div className="overflow-y-auto max-h-[50vh]">
            <DataTable columns={columns} data={data} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
