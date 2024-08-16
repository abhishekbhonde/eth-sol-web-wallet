import React, { useState } from "react";
import { generateMnemonic } from "bip39";

const GenerateMnemonic = () => {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  const formatMnemonic = (mnemonic) => {
    return mnemonic.split(' ').map((word, index) => (
      <span key={index} className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700">{word}</span>
    ));
  };

  return (
    <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <button
        onClick={handleGenerateMnemonic}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
      >
        Create Seed Phrase
      </button>
      <div className="mt-6 grid grid-cols-4 gap-2 max-w-xl w-full">
        {formatMnemonic(mnemonic)}
      </div>
    </div>
  );
};

export default GenerateMnemonic;
