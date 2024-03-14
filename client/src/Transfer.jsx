import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ setBalance, address, address2 }) {
  const [sendAmount, setSendAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      let msgHash = keccak256(utf8ToBytes(sendAmount));
      let signature = (secp256k1.sign(msgHash, privateKey));
      let recoveryBit = signature.recovery;

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: address2,
        msgHash: toHex(msgHash),
        signature: signature.toCompactHex(),
        recoveryBit: recoveryBit,
      });

      setBalance(balance);

    } catch (ex) {
      alert(ex.response.data.message);
    }
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
        Private Key of Sender to Sign the Transaction
        <input
          placeholder="In real life this would be passed from Wallet. Never enter private key!"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sign and Transfer" />
    </form>
  );
}

export default Transfer;
