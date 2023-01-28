import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import { sign, verify } from "ethereum-cryptography/secp256k1"

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let { signature, messageHash } = await signTranscation(sendAmount, address, privateKey)
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        messageHash,
        signature,
        
      });
      setBalance(balance);
      alert("amount transfered")
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  async function signTranscation(amount, publicKey, privateKey) {
    const message_string = JSON.stringify({amount:amount, publicKey: publicKey})
    const messageHash = toHex(keccak256(utf8ToBytes(message_string)));
    let signature = await sign(messageHash, privateKey);
    return { signature:toHex(signature), messageHash};
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      
      <input type="submit" className="button" value="Transfer" disabled={sendAmount=="" || address=="" || recipient==""}/>
    </form>
  );
}

export default Transfer;
