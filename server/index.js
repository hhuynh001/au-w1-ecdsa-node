const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "031bcc1c63fac8f0db52d2577ccf6bf4d016c1d93db5fc7f53944bd930581e679c": 200,
  "038ec38fa23646702ae7f564f0a9123991cbecbf3763a0c8351f4ae17cb673a635": 150,
  "03201bbdf7d5a01a9a7e2e4531a29d70f8771955f70b7026914d986a0928be2409": 175,
  "02b605fa8936740de1407309ae485de3cc9dada6d419aa916282aef98d6c37cace": 100,
};

// associated private keys for the public keys
const privateKeys = {
  "031bcc1c63fac8f0db52d2577ccf6bf4d016c1d93db5fc7f53944bd930581e679c": "55fe18c18cea7e912679038b4c8e506df18db4436af927e2de9ff9e08cdfcb2e",
  "038ec38fa23646702ae7f564f0a9123991cbecbf3763a0c8351f4ae17cb673a635": "f1a023622f1a15d89edf59cb21171d5d966a3d105d1bd0ef9e54c0816910877a",
  "03201bbdf7d5a01a9a7e2e4531a29d70f8771955f70b7026914d986a0928be2409": "dae0025e52537e5929260571cb302434b08461d09c66b929cc1e493baa241909",
  "02b605fa8936740de1407309ae485de3cc9dada6d419aa916282aef98d6c37cace": "7775b867f062208448e31d2592ba837b32c3b3ed409958dc56f8aae6d82a65d9",
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

const { sender, recipient, amount, msgHash, signature, recoveryBit } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  console.log("sender: ", sender);
  console.log("recipient: ", recipient);
  console.log("amount: ", amount); 
  console.log("msgHash: ", msgHash);
  console.log("signature: ", signature);
  console.log("recoveryBit: ", recoveryBit);

  let recoveredSignature = secp256k1.Signature.fromCompact(signature);
  recoveredSignature.recovery = recoveryBit;
  let senderPublicKey = recoveredSignature.recoverPublicKey(msgHash).toHex();

  if (sender === senderPublicKey) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;

      console.log("sender balance: ", balances[sender]);
      console.log("recipient balance: ", balances[recipient]);

      res.send({ balance: balances[sender]});
    }
  } else {
    console.log("Sender signature not valid. Transaction denied!");
    res.status(400).send({ message: "Sender signature not valid. Transaction denied!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
