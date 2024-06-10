import InstitutionContract from '../../contracts/insitution.json';
import { ErrorMessage, Field, Formik } from 'formik';
import { ReceiverRegistrationSchema } from '../../models/receiver/ReceiverRegistration.model';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CustomToast, ToastType } from '../../shared/components/toast';
import { connectWallet } from '../../shared/helper/wallet';
import { web3ErrorHanlder } from '../../shared/helper/errorHandler';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ReceiverRegistration() {
  const [address, setAddress] = useState('');
  const contractAddress = '0xdE568E6e6cdc95eFb4D43E744570E1a925352808';
  const contractABI = InstitutionContract.abi;

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

  const handleRegister = async (name: string, email: string) => {
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
      const tx = await contract.register(name, email);

      await tx.wait();
    } catch (err: any) {
      throw web3ErrorHanlder(err.info.error);
    }
  };

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

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-slate-800">
        <div className="h-auto p-2 md:p-5 rounded-md shadow-lg bg-white ">
          <div className="mb-8 ">
            <h1 className="text-lg font-bold text-center">
              Receiver Registration
            </h1>
          </div>
          <div className="items-start">
            <Formik
              initialValues={{ name: '', email: '' }}
              validationSchema={ReceiverRegistrationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(false);
                try {
                  await handleRegister(values.name, values.email);
                  await CustomToast({
                    type: ToastType.SUCCESS,
                    title: 'Receiver registered successfully',
                  });
                  resetForm();
                } catch (err: any) {
                  await CustomToast({
                    type: ToastType.ERROR,
                    title: err,
                  });
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="">
                      <div className="md:flex justify-between items-center">
                        <div className="w-32">
                          <label htmlFor="name" className="">
                            Name
                          </label>
                        </div>

                        <div className="w-full">
                          <Field
                            name="name"
                            type="text"
                            className="border-b-2 p-1 w-full focus:outline-none focus:border-b-2 focus:border-slate-950"
                          />
                        </div>
                      </div>

                      <div className="ml-[100px]">
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-600 text-start"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="md:flex justify-between items-center">
                        <div className="w-32">
                          <label htmlFor="email" className="">
                            Email
                          </label>
                        </div>

                        <div className="w-full">
                          <Field
                            name="email"
                            type="email"
                            className="border-b-2 p-1 w-full focus:outline-none focus:border-b-2 focus:border-slate-950"
                          />
                        </div>
                      </div>

                      <div className="ml-[100px]">
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600 text-start"
                        />
                      </div>
                    </div>

                    <div className="w-full flex justify-center mt-7">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white text-center   rounded-md bg-slate-900 py-3 w-1/2"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Formik>
          </div>
          <div className="mt-6">
            <p>your address: {address}</p>
          </div>
        </div>
      </div>
    </>
  );
}
