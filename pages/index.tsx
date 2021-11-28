import styles from '../styles/Home.module.css'
import WalletLoader from '../components/WalletLoader'
import { useSigningClient } from '../contexts/cosmwasm'
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from '../util/conversion'
import { useAlert } from 'react-alert'
import Emoji from '../components/Emoji'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uconst'
const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

export default function Home() {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [balance, setBalance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [NftUri, setNftUri] = useState('')
  const alert = useAlert()

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) return

    // Gets native balance (i.e. Archway balance)
    signingClient.getBalance(walletAddress, PUBLIC_STAKING_DENOM).then((response: any) => {
      const { amount, denom }: { amount: number; denom: string } = response
      setBalance(`${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`)
      setWalletAmount(convertMicroDenomToDenom(amount))
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.getBalance(): ', error)
    })
  }, [signingClient, walletAddress, loadedAt, alert])

  useEffect(() => {
    if (!signingClient) return

    // Gets token information
    signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {"nft_info":{"token_id":"1"}}).then((response) => {
      setNftUri(response.token_uri);
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() token_info: ', error)
    })
  }, [signingClient, alert])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <WalletLoader loading={loading}>
          {balance && (
            <p className="text-primary">
              <span>{`Your wallet has ${balance} `}</span>
              <Emoji label="dog2" symbol="🐕" />
            </p>
          )}

          {NftUri && (
            <p className="text-primary">
              <span>{`TokenId No.1 NFT URI is ${NftUri} `}</span>
              <Emoji label="cat" symbol="😻" />
            </p>
          )}
        </WalletLoader>
      </main>
    </div>
  )
}
