import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import axios from 'axios';

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [balances, setBalances] = useState({});
    const [loadingAddress, setLoadingAddress] = useState(null); // Track which address is being fetched

    const fetchBalance = async (address) => {
        setLoadingAddress(address); // Set the current address as loading
        try {
            const response = await axios.post("https://eth-mainnet.g.alchemy.com/v2/6gApTcGs5H-uS-wWJutSRTXKjjJhWnt3", {
                jsonrpc: "2.0",
                id: 2,
                method: "eth_getBalance",
                params: [address, "latest"]
            });
    
            // Extract balance from the response
            const balanceHex = response.data.result;
            const balance = parseInt(balanceHex, 16); // Convert from hex to decimal
    
            setBalances(prevBalances => ({ ...prevBalances, [address]: balance }));
        } catch (error) {
            console.error("Error fetching balance:", error.response ? error.response.data : error.message);
        }
        setLoadingAddress(null); // Reset loading state
    };

    const handleAddWallet = async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, wallet.address]);
    };

    return (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-md bg-white">
            <button
                onClick={handleAddWallet}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
                Add ETH Wallet
            </button>

            <div className="mt-4">
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <div key={index} className="py-2 px-3 mb-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-700 break-all">{address}</span>
                            <button
                                onClick={() => fetchBalance(address)}
                                className="ml-4 px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            >
                                {loadingAddress === address ? "Fetching..." : "Get Balance"}
                            </button>
                            {balances[address] && (
                                <span className="ml-4 text-sm text-gray-600">
                                    Balance: {parseFloat(balances[address]) / 1e18} ETH
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No ETH wallets added yet.</p>
                )}
            </div>
        </div>
    );
};
