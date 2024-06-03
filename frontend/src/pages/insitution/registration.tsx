import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import InstitutionContract  from "../../contracts/insitution.json"

declare global {
    interface Window {
      ethereum?: any;
    }
  }

export default function InstitutionRegistration() {
    const [address, setAddress] = useState("")
    let provider: ethers.BrowserProvider;
    const contractAddress = "0x688d4fC40786Fa1E294901e970d1576D4D596f7c";
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
            <div>
                <h1>Institution Registration</h1>
            </div>
            <div>
                <form onSubmit={handleRegister}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" />
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                    <button type="submit">Register</button>
                </form>
            </div>
            <div>
                <p>your address: {address}</p>
            </div>
        </>
    )
}