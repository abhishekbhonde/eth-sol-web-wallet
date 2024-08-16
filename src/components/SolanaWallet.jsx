import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import axios from "axios";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [balances, setBalances] = useState({});
    const [loadingAddress, setLoadingAddress] = useState(null);

    const fetchBalance = async (publicKey) => {
        setLoadingAddress(publicKey); // Set the current address as loading
        try {
            const response = await axios.post("https://solana-mainnet.g.alchemy.com/v2/6gApTcGs5H-uS-wWJutSRTXKjjJhWnt3", {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [publicKey]
            });
            const balanceLamports = response.data.result; // Balance in lamports
            setBalances(prevBalances => ({ ...prevBalances, [publicKey]: balanceLamports }));
        } catch (error) {
            console.error("Error fetching balance:", error.response ? error.response.data : error.message);
        }
        setLoadingAddress(null); // Reset loading state
    };

    const handleAddWallet = async () => {
        try {
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            const publicKey = keypair.publicKey.toBase58();

            setPublicKeys([...publicKeys, publicKey]);
            setCurrentIndex(currentIndex + 1);

            // Optionally fetch the balance immediately after adding
            // fetchBalance(publicKey); // Commented out to only fetch balance when button is clicked
        } catch (error) {
            console.error("Error adding wallet:", error);
        }
    };

    return (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-md bg-white">
            <button
                onClick={handleAddWallet}
                className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
                Add Solana Wallet
            </button>
            <div className="mt-4">
                {publicKeys.length > 0 ? (
                    publicKeys.map((key, index) => (
                        <div key={index} className="py-2 px-3 mb-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-700 break-all">{key}</span>
                            <button
                                onClick={() => fetchBalance(key)}
                                className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            >
                                {loadingAddress === key ? "Fetching..." : "Get Balance"}
                            </button>
                            {balances[key] !== undefined && loadingAddress !== key && (
                                <span className="ml-4 text-sm text-gray-600">
                                    Balance: {balances[key] / 1e9} SOL
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No Solana wallets added yet.</p>
                )}
            </div>
        </div>
    );
}
