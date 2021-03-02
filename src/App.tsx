import React, {useCallback, useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import WalletInfo from './components/WalletInfo';
import Orders from './components/Orders';
import Web3Modal from "web3modal";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { GetSmartWallet } from './hooks/GetSmartWallet'
import { GetSmartWalletBalance } from './hooks/GetSmartWalletBalance'
import { GetAddress} from './hooks/GetAddress'
import { GetPendingOrders} from './hooks/GetPendingOrders'
import { GetPositions } from './hooks/GetPositions'
import { Button } from "antd";
import { Order, Position } from "./types";
import Positions from './components/Positions'

const xdaiProvider = new JsonRpcProvider("https://rpc.xdaichain.com/")

function App() {

  const [injectedProvider, setInjectedProvider] = useState<Web3Provider | undefined>(undefined)

  const address = GetAddress(injectedProvider as any)
  const smartWallet = GetSmartWallet(injectedProvider as any, '0xCaD18E65F91471C533ee86b76BCe463978f593AA')
  const smartWalletBalance = GetSmartWalletBalance(injectedProvider as any, smartWallet)

  const orders = GetPendingOrders(injectedProvider as any, '0xCaD18E65F91471C533ee86b76BCe463978f593AA')
  const positions = GetPositions(injectedProvider as any, smartWallet)


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      {(typeof injectedProvider == "undefined") ? <Button
        onClick={loadWeb3Modal}
      >Connect </Button>: "🟢Connected"}
      <WalletInfo
        address = {address}
        smartWallet = {smartWallet}
        balance = {smartWalletBalance}
      /> <hr />
      <Orders
        orders = {orders as Order[]}
      /> <hr />
      <Positions positions = {positions as Position[]}/>
      <br />
    </div>
  );
}

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

 window.ethereum && window.ethereum.on('chainChanged', (chainId: number) => {
  setTimeout(() => {
    window.location.reload();
  }, 1);
})


export default App;
