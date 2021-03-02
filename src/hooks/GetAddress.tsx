import { useState, useEffect } from "react";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export function GetAddress(provider: Web3Provider) {
  const [address, setAddress] = useState<string>()
  useEffect(() => {
    async function getData() {
      if (typeof provider !== "undefined") {
        try {
          const accounts = await provider.listAccounts();
          let newValue;
          if (accounts && accounts.length>0) {
            newValue = accounts[0]
          } else {
            console.log('error')
          }
          if (newValue !== address) {
            setAddress(newValue)
          }
        } catch (e) {
          console.log('error', e)
        }
      }
    }
    getData()
  }, [provider]);
  return address as string
}
