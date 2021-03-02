interface WalletInfoProps {
  address: string,
  smartWallet: string,
  balance: number
}

export default function WalletInfo(props: WalletInfoProps) {
  const {address, smartWallet, balance} = props
  return(
    <div>
      <p>Your address {address}</p>
      <p>Your smart wallet {smartWallet} </p>
      <p>Smart wallet balance: ${balance} </p>
    </div>
  );
}
