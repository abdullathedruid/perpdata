import { useState, useEffect } from "react";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import LOB_ABI from '../abi/LOB.abi.json'
import { Order } from "../types";
import {formatUnits} from "@ethersproject/units";

export function GetPendingOrders(provider: Web3Provider, user: string) {
  const [exportOrders, setOrders] = useState<Order[]>()
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
          const contract = new Contract('0xb1a797c31c67049CF3F78cbf1CDD65579A211E0B', LOB_ABI, signer)
          let ordersCreated: number[] = []
          let ordersFilled: number[] = []
          let outputC = []
          let outputF = []

          let orderCreatedFilter = contract.filters.OrderCreated(user)
          outputC = await contract.queryFilter(orderCreatedFilter)
          outputC.forEach(element => {
              ordersCreated.push(element.args?.order_id.toNumber())
          });

          let orderFilledFilter = contract.filters.OrderFilled()
          outputF = await contract.queryFilter(orderFilledFilter)
          outputF.forEach(element => {
              ordersFilled.push(element.args?.order_id.toNumber())
          });
          let pendingOrders = ordersCreated.filter( function( el ) {
            return ordersFilled.indexOf( el ) < 0;
          } );

          let orders: Order[] = []
          pendingOrders.forEach(async element => {
            var order = await contract.getLimitOrder(element)
            if(order.stillValid) {
              orders.push({
                order_id: element,
                orderType: order.orderType,
                asset: order.asset,
                reduceOnly: order.reduceOnly,
                expiry: order.expiry.toNumber(),
                collateral: parseFloat(formatUnits(order.collateral.d,18)),
                leverage: parseFloat(formatUnits(order.leverage.d,18)),
                slippage: parseFloat(formatUnits(order.slippage.d,18)),
                tipFee: parseFloat(formatUnits(order.tipFee.d,18)),
                orderSize: parseFloat(formatUnits(order.orderSize.d,18)),
                limitPrice: parseFloat(formatUnits(order.limitPrice.d,18)),
                stopPrice: parseFloat(formatUnits(order.stopPrice.d,18))
              })
            }
          })
          // console.log(orders)
          setOrders(orders)
        } catch (e) {
          console.log('error', e)
        }
      }
    }
    getData()
  }, [provider, user])
  return exportOrders
}
