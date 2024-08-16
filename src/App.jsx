import { useState } from 'react';
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './components/SolanaWallet';
import { EthWallet } from './components/EthWallet';

function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  const formatMnemonic = (mnemonic) => {
    return mnemonic.split(' ').map((word, index) => (
      <span key={index} className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700">
        {word}
      </span>
    ));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
        onClick={handleGenerateMnemonic}
      >
        Create Seed Phrase
      </button>
      <div className="mt-4">
        <input 
          type="text" 
          value={mnemonic} 
          readOnly 
          className="p-4 border border-gray-300 rounded-lg w-full bg-white shadow-sm"
        />
      </div>
      {mnemonic && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {formatMnemonic(mnemonic)}
        </div>
      )}
      {mnemonic && (
        <>
          <SolanaWallet mnemonic={mnemonic} />
          <EthWallet mnemonic={mnemonic} />
        </>
      )}
    </div>
  );
}

export default App;
