import { useState } from 'react';
import PageTitle from '../../shared/components/page_title';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

export default function VerifyStatus() {
  PageTitle('Verify Status');

  const [credential, setCredential] = useState('');
  const [recordData, setRecordData] = useState<any>(null);
  const [isValid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    console.log('Credential:', credential);
    const decoded = decodeCredential(credential);
    if (decoded) {
      console.log('Decoded Credential:', decoded);
      try {
        const result = await fetchFromIPFS(decoded.cid, decoded.filename);
        const data = await result.json();
        console.log('Result:', data);
        // Update the state with the fetched data
        setRecordData(data);

        // validate the merkle tree

        const recordData = [
          data.data['address'],
          data.data['title'],
          data.data['name'],
          data.data['description'],
          data.data['issueDate'],
        ];

        validate(data['root'], recordData, data['proof']);
        console.log(recordData);

        // validate the root is exist on the blockchain or not
      } catch (error) {
        console.error('Failed to fetch data from IPFS', error);
      }
    } else {
      console.log('Invalid Credential');
    }
    setIsLoading(false);
  };

  const decodeCredential = (cred: string) => {
    try {
      // Decode the Base64 string
      const decodedInput = atob(cred);
      const [cid, filename, salt] = decodedInput.split('|');

      // Return the original components
      return { cid, filename };
    } catch (error) {
      return null; // Return null if decoding fails
    }
  };

  const fetchFromIPFS = async (cid: string, fileName: string) => {
    try {
      console.log(cid);
      var result = await fetch(
        `https://ipfs.io/ipfs/${cid}/data_${fileName}.json`
      );
      return result;
    } catch (error) {
      throw new Error('Failed to fetch data from IPFS');
    }
  };

  const validate = (root: string, recordData: string[], proof: string[]) => {
    const isValid = StandardMerkleTree.verify(
      root,
      ['string', 'string', 'string', 'string', 'string'],
      recordData,
      proof
    );

    console.log('isvalid: ', isValid);
  };
  return (
    <div className="bg-slate-800 h-screen flex justify-center items-center">
      <div className="space-y-4 w-2/3 grid grid-cols-2 gap-4">
        {/* First card for input and verification */}
        <div className="p-4 bg-white rounded-md shadow-lg space-y-4 col-span-2">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="record-cred"
            >
              Credential
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 min-h-[40px]"
              name="record-cred"
              id="record-cred"
              value={credential}
              onChange={e => setCredential(e.target.value)}
            />
          </div>
          <button
            className="w-full text-white bg-slate-900 py-2 rounded-md hover:bg-opacity-70"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Second card for displaying record data and status */}
        {recordData && (
          <div className="p-4 bg-white rounded-md shadow-lg space-y-4 col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Title</p>
                <div className="w-full border border-gray-300 rounded-md px-2 py-4 bg-gray-100">
                  <p>{recordData.data['title']}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Issued Date</p>
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100">
                  <p>{recordData.data['issueDate']}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Awardee Address</p>
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100">
                  <p>{recordData.data['address']}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Institution Address</p>
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100">
                  <p>{recordData.data['issuerAddress']}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Awarded To</p>
              <div className="w-full border border-gray-300 rounded-md px-2 py-4 bg-gray-100">
                <p>{recordData.data['name']}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Description</p>
              <div className="w-full border border-gray-300 rounded-md px-2 py-4 bg-gray-100">
                <p>{recordData.data['description']}</p>
              </div>
            </div>
          </div>
        )}

        {recordData && (
          <div className="p-4 bg-white rounded-md shadow-lg space-y-4 col-span-2">
            <div>
              <p className="text-sm font-medium">Verification Status</p>
              <div className="w-full border border-gray-300 rounded-md px-2 py-4 bg-gray-100">
                <p>{isValid ? 'Verified' : 'Not Verified'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
