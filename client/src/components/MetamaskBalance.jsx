import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./Metamask.style.css";

function MetamaskWalletChecker() {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [balance, setBalance] = useState(null);

  const checkMetamaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setIsMetamaskConnected(true);
        } else {
          setIsMetamaskConnected(false);
        }
      } catch (error) {
        console.error(error);
        setIsMetamaskConnected(false);
      }
    } else {
      setIsMetamaskConnected(false);
    }
  };

  const checkBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      try {
        const address = "0x6D94D14266514d163A91B4416C7b99B3f7Da12b2";

        const web3Balance = await web3.eth.getBalance(address);
        const ehtBalance = web3.utils.fromWei(web3Balance, "ether");
        console.log("balance: ", ehtBalance);
        setBalance(ehtBalance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Metamask is not installed");
    }
  };

  useEffect(() => {
    checkMetamaskConnection();
    checkBalance();
  }, []);

  return (
    <div>
      {isMetamaskConnected ? (
        <p className="success">Connected</p>
      ) : (
        <p className="alert">Error - Not Connected</p>
      )}
      {balance ? (
        <p className="success">{balance}</p>
      ) : (
        <p className="alert">Error loading the balance - null</p>
      )}
    </div>
  );
}

export default MetamaskWalletChecker;
