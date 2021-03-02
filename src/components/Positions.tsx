import { Position } from "../types";

interface PositionsProps{
  positions: Position[]
}

export default function Positions(props: PositionsProps) {
  const {positions} = props

  return(<div>
    Current positions:
      <table>
        <tr>
          <th>Asset</th>
          <th>Direction</th>
          <th>Position Size</th>
          <th>PnL</th>
        </tr>
      {(positions)?positions.map((pos) => {
        return(
          <tr>
            <td>{pos.asset}</td>
            <td>{pos.positionSize>=0?'LONG':'SHORT'}</td>
            <td>{pos.positionSize.toFixed(6)}</td>
            <td>${pos.PnL.toFixed(2)}</td>
          </tr>
        )
      }):'Loading..'}
      </table>
    </div>
  )
}
