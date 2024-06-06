import InstitutionContract  from "../../contracts/insitution.json"
import { ErrorMessage, Field, Formik } from "formik";
import { ReceiverRegistrationSchema } from '../../models/receiver/ReceiverRegistration.model';
import { useState, useEffect } from 'react';
import {ethers} from "ethers";

declare global {
    interface Window {
      ethereum?: any;
    }
  }

export default function ReceiverRegistration() {
    const [address, setAddress] = useState("")
    let provider: ethers.BrowserProvider;
    const contractAddress = "0xdE568E6e6cdc95eFb4D43E744570E1a925352808";
    const contractABI =  InstitutionContract.abi;
    let signer = null
     const connectWallet = async () => {
        
        try {
            if (typeof window.ethereum === 'undefined' || window.ethereum === null) {
                throw new Error('No Ethereum wallet detected. Please install MetaMask.');
            }

            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            // Set the address state
            setAddress(userAddress);
         
        } catch (err) {
            console.error(err);
    
        }
    };

    const handleRegister = async (e: any) => {
        e.preventDefault()

        try {
            if (!address) {
                throw new Error('Please connect your wallet');
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.register("testInstitution", "testInstitution@example.com");
            
            await tx.wait()
            console.log('Transaction successful!');
            console.log(`trainsaction hash: ${tx.hash}`);
  
        } catch (err) {
            console.error(err);
        }

    }

    useEffect(() => {
        connectWallet()
        if (window.ethereum) {
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                console.log(accounts);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.off('accountsChanged', function(accounts: string[]) {});
            }
        };
    }, [address])


    return (
        <>
            <div className="h-screen flex justify-center items-center bg-slate-800">
                <div className="h-auto p-2 md:p-5 rounded-md shadow-lg bg-white ">
                    <div className="mb-8 ">
                        <h1 className="text-lg font-bold text-center">Receiver Registration</h1>
                    </div>  
                    <div className="items-start">
                        <Formik
                        initialValues={{name: '', email: ''}}
                        validationSchema={ReceiverRegistrationSchema}
                        onSubmit={(values) => 
                            console.log(values)
                        }
                        >   
                        {() => (
                            <div>
                                <form className="flex flex-col gap-4">
                                   <div className="">
                                    <div className="md:flex justify-between items-center">
                                        <div className="w-32">
                                            <label htmlFor="name" className="">Name</label>
                                        </div>
                                            
                                        <div className="w-full"> 
                                            <Field name="name" type="text"  className="border-b-2  border-gray-500  p-1 w-full" />
                                        </div>
                                            
                                        </div>

                                        <div className="ml-[100px]">
                                            <ErrorMessage name="name" component="div" className="text-red-600 text-start"/>
                                        </div>
                                    </div>

                                    <div>
                                    <div className="md:flex justify-between items-center">
                                        <div className="w-32">
                                            <label htmlFor="email" className="">Email</label>
                                        </div>
                                            
                                        <div className="w-full"> 
                                            <Field name="email" type="email"  className="border-2 border-gray-500 rounded p-1 w-full "/>
                                        </div>
                                            
                                        </div>

                                        <div className="ml-[100px]">
                                            <ErrorMessage name="email" component="div" className="text-red-600 text-start"/>
                                        </div>
                                    </div>
                                    
                                   
                                    <div className="w-full flex justify-center mt-7">
                                        <button type="submit" className="text-white text-center   rounded-md bg-slate-900 py-3 w-1/2">Register</button>
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
    )
}