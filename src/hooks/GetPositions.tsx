import { useState, useEffect } from "react";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import CH_ABI from '../abi/CH.abi.json'
import { Position, assets } from "../types";
import {formatUnits} from "@ethersproject/units";

export function GetPositions(provider: Web3Provider, smartWallet: string) {
  const [exportPositions, setPositions] = useState<Position[]>()
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
          const contract = new Contract('0x5d9593586b4B5edBd23E7Eba8d88FD8F09D83EBd', CH_ABI, signer)
          let positions: Position[] = []

          for (let [key, value] of assets) {
            var pos = await contract.getPosition(key,smartWallet)
            if(parseFloat(formatUnits(pos.size.d,18))!=0){
              var pos2 = await contract.getPositionNotionalAndUnrealizedPnl(key,smartWallet,0)
              positions.push({
                asset: value,
                positionSize: parseFloat(formatUnits(pos.size.d,18)),
                PnL: parseFloat(formatUnits(pos2.unrealizedPnl.d,18))
              })
            }
          }
          setPositions(positions)
        } catch (e) {
          console.log('error', e)
        }
      }
    }
    getData()
  }, [provider, smartWallet])
  return exportPositions
}
