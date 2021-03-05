import React, {useCallback, useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import WalletInfo from './components/WalletInfo';
import Orders from './components/Orders';
import Web3Modal from "web3modal";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
// import { GetSmartWallet } from './hooks/GetSmartWallet'
import { GetSmartWalletBalance } from './hooks/GetSmartWalletBalance'
import { GetAddress} from './hooks/GetAddress'
import { GetPendingOrders} from './hooks/GetPendingOrders'
import { GetPositions } from './hooks/GetPositions'
import { Button } from "antd";
import { Order, Position } from "./types";
import Positions from './components/Positions'
import { Contract } from "@ethersproject/contracts";
import SWF_ABI from './abi/SWF.abi.json'
import LOB_ABI from './abi/LOB.abi.json'
import USDC_ABI from './abi/USDC.abi.json'
import Notify from 'bnc-notify'
import Onboard from 'bnc-onboard'
import web3 from 'web3'
import { ethers, utils } from 'ethers'
const xdaiProvider = new JsonRpcProvider("https://rpc.xdaichain.com/")

const notify = Notify({
  dappId: "6e2311b0-3480-4909-8b23-b012a58a060d",
  networkId: 100,
  darkMode: true,
  desktopPosition: 'topRight'
})

let provider : any

function App() {
  const [wallet, setWallet] = useState<any | null>({})
  const [address, setAddress] = useState<string>("")
  const [network, setNetwork] = useState<number>(0)
  const [balance, setBalance] = useState<string>("")
  const [onboard, setOnboard] = useState<any | null>(null)
  const [smartWallet, setSmartWallet] = useState<string>("")
  const [smartWalletBalance, setSmartWalletBalance] = useState<number>(0)
  useEffect(() => {
    const onboard = Onboard({
      dappId: "6e2311b0-3480-4909-8b23-b012a58a060d",
      networkId: 100,
      darkMode: true,
      subscriptions: {
        address: setAddress,
        network: network => {
          setNetwork(network)
          onboard.walletCheck()
        },
        balance: setBalance,
        wallet: wallet => {
          if(wallet.provider) {
            setWallet(wallet)
            const ethersProvider = new ethers.providers.Web3Provider(wallet.provider)
            provider = ethersProvider
            console.log(`${wallet.name} is now connected!`)
            window.localStorage.setItem('selectedWallet', wallet.name || '{}')
          } else {
            setWallet({})
            provider = null
          }
        }
      }
    })
    setOnboard(onboard)
  }, [])

  useEffect(() => {
    console.log(provider)
  }, [provider])

  useEffect(() => {
    async function getSmartWallet() {
      if(onboard && provider) {
        const contract = new Contract('0x2dE89197d14F1947AcADDB50F61917aab377734e',SWF_ABI,provider)
        setSmartWallet(await contract.getSmartWallet(address))
      } else { return false }
    }
    getSmartWallet()
  }, [address])

  useEffect(() => {
    async function getWalletBalance() {
      if(onboard && provider) {
        const contract = new Contract('0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', USDC_ABI, provider)
        setSmartWalletBalance(parseFloat(utils.formatUnits(await contract.balanceOf('0xe028CB3E566059A0a0D43b90eF011eA1399E29c8'),6)))
      } else { return false }
    }
    getWalletBalance()
  }, [smartWallet])

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      'selectedWallet'
    )

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  async function login() {
    await onboard.walletSelect()
    await onboard.walletCheck()
  }

  async function readyToTransact() {
    if (!provider) {
      const walletSelected = await onboard.walletSelect()
      if (!walletSelected) return false
    }
    const ready = await onboard.walletCheck()
    return ready
  }

  async function sendHash() {
    const signer = provider.getSigner()

    const contract = new Contract('0x2dE89197d14F1947AcADDB50F61917aab377734e',SWF_ABI,signer)

    try{
      const { hash } = await contract.spawn()
      const { emitter } = notify.hash(hash)
      console.log(hash)

      emitter.on('all',console.log)
    } catch (e) {
      var message = e.message
      if(e['data']) {
        notify.notification({type: 'error', message: e.data.code + e.data.message, autoDismiss: 4000})
      } else {
        notify.notification({type: 'error', message: e.message, autoDismiss: 4000})
      }
    }

  }

  return onboard && notify ? (
    <div className="App">

    {!wallet.provider && (<Button onClick={() => { login() }}>Connect Wallet</Button>)}

    {wallet.provider && (<div>Connected <br />Address: {address}<br />Balance: {Number(balance) > 0 ? (Number(balance) / 1000000000000000000).toFixed(2) : balance}xDAI</div>)}

    {(wallet.address) ? (<Button onClick = {async() => {
      const ready = await readyToTransact()
      if(!ready) return
      sendHash()
    }}>Spawn Wallet</Button>) : <p>Smart Wallet: {smartWallet}</p>}

    {<p>USDC balance: ${smartWalletBalance.toFixed(2)}</p>}

    </div>
  ) : ( <div>Loading...</div>)
}

export default App;
