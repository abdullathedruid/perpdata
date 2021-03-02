export interface Order {
  order_id: number,
  orderType: number,
  limitPrice: number,
  asset: string,
  reduceOnly: boolean,
  expiry: number,
  stopPrice: number,
  orderSize: number,
  collateral: number,
  leverage: number,
  slippage: number,
  tipFee: number
}

export interface Position {
  asset: string,
  positionSize: number,
  PnL: number
}

export const assets : Map<string, string> = new Map();
assets.set('0x0f346e19F01471C02485DF1758cfd3d624E399B4','BTC')
assets.set('0xb397389B61cbF3920d297b4ea1847996eb2ac8E8','SNX')
assets.set('0x80DaF8ABD5a6Ba182033B6464e3E39A0155DCC10','LINK')
assets.set('0x8d22F1a9dCe724D8c1B4c688D75f17A2fE2D32df','ETH')
assets.set('0xd41025350582674144102B74B8248550580bb869','YFI')
assets.set('0x6de775aaBEEedE8EFdB1a257198d56A3aC18C2FD','DOT')
assets.set('0x16A7ECF2c27Cb367Df36d39e389e66B42000E0dF','AAVE')
