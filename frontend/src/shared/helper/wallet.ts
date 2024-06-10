import { ErrorInfo } from "../../models/error/ErrorInfo.model";
import { ethers } from "ethers";

type WalletPayload = {
    onSuccess: (address: string, signer: ethers.JsonRpcSigner) => void,
    onError: (error: ErrorInfo) => void
}

const connectWallet = async (props: WalletPayload) => {
    try {
                if (typeof window.ethereum === 'undefined' || window.ethereum === null) {
                    throw new Error('No Ethereum wallet detected. Please install MetaMask.');
                }
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();

                // Set the address state & signer
                props.onSuccess(userAddress, signer);
            
            } catch (err: any) {
                props.onError(err.info.error)
            }
};

export {connectWallet}