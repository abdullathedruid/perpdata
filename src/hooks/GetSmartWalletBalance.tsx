import { useState, useEffect } from "react";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import USDC_ABI from '../abi/USDC.abi.json'
import {formatUnits} from "@ethersproject/units";

export function GetSmartWalletBalance(provider: Web3Provider, user: string) {
  const [balance, setBalance] = useState<number>()
  useEffect(() => {
    async function getData() {
      if (typeof provider !== "undefined" && typeof user !=="undefined") {
        try {
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length>0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const contract = new Contract('0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', USDC_ABI, signer)
          let newValue;
          newValue = await contract.balanceOf(user)
          newValue = parseFloat(formatUnits(newValue, '6'))
          if (newValue !== balance) {
            setBalance(newValue)
          }
        } catch (e) {
          console.log('error', e)
        }
      }
    }
    getData()
  }, [provider, user]);
  return balance as number
}
