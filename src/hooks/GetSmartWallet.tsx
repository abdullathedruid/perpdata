import { useState, useEffect } from "react";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import SWF_ABI from '../abi/SWF.abi.json'

export function GetSmartWallet(provider: Web3Provider, user: string) {
  const [address, setAddress] = useState<string>()
  useEffect(() => {
    async function getData() {
      if (typeof provider !== "undefined") {
        try {
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length>0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const contract = new Contract('0x2dE89197d14F1947AcADDB50F61917aab377734e', SWF_ABI, signer)
          let newValue = await contract.getSmartWallet(user)
          if (newValue !== address) {
            setAddress(newValue)
          }
        } catch (e) {
          console.log('error', e)
        }
      }
    }
    getData()
  }, [provider, user]);
  return address as string
}
