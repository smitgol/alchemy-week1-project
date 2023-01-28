import server from "./server";
import { getPublicKey, utils}  from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  const [isValid, setIsValid ] = useState(false);
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const {key, isValid} = getPublicKeyFromPrivateKey(privateKey);
    setIsValid(isValid);
    setAddress(key);
    if (isValid) {
      const {
        data: { balance },
      } = await server.get(`balance/${key}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  const getPublicKeyFromPrivateKey = (privateKey) => {
    try {
      return { key: toHex(getPublicKey(utils.hexToBytes(privateKey))), isValid: true}
    }
    catch {
      return {key: privateKey, isValid: false}
    }
    
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={onChange}></input>
        {!isValid && <small className="error-message">invalid private key</small>}
      </label>
        {isValid && <div className="public-key">{ address.slice(0,25) }...</div>}
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
