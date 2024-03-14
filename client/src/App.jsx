import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [balance2, setBalance2] = useState(0);
  const [address2, setAddress2] = useState("");

  return (
    <div className="app">
      <Wallet
        title = "Sender"
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Wallet
        title = "Reciepient"
        balance={balance2}
        setBalance={setBalance2}
        address={address2}
        setAddress={setAddress2}
      />
      <Transfer 
        setBalance={setBalance}
        setBalance2={setBalance2}  
        address={address}
        address2={address2}
      />
    </div>
  );
}

export default App;
