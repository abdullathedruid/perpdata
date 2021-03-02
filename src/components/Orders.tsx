import { Order, assets} from "../types";

interface OrdersProps{
  orders: Order[]
}

const ORDER_TYPES: string[] = [
  'Market',
  'Limit',
  'Stop',
  'Stop Limit',
  'Trailing Stop',
  'Trailing Stop Limit'
]




export default function Orders(props: OrdersProps) {
  const {orders} = props

  return(
    <div>
      Pending orders:
      <table>
        <tr>
          <th>Order id</th>
          <th>Order Type</th>
          <th>Asset</th>
          <th>Direction</th>
          <th>Size</th>
          <th>Limit</th>
          <th>Stop</th>
          <th>Collateral</th>
          <th>Bot fee</th>
          <th>Reduce only</th>
          <th>Expiry</th>
        </tr>
      {(orders)?orders.map((order) => {
        return(
            <tr>
              <td>{order.order_id}</td>
              <td>{ORDER_TYPES[order.orderType]}</td>
              <td>{assets.get(order.asset)}</td>
              <td>{order.orderSize>0?'BUY':'SELL'}</td>
              <td>{order.orderSize.toFixed(3)}</td>
              <td>{order.limitPrice.toFixed(2)}</td>
              <td>{order.stopPrice.toFixed(2)}</td>
              <td>{order.collateral.toFixed(2)}</td>
              <td>{order.tipFee.toFixed(2)}</td>
              <td>{order.reduceOnly?'True':'False'}</td>
              <td>{order.expiry}</td>
            </tr>
        )
      }):'Loading..'}
      </table>
    </div>
  )
}
