import WalletLoader from '../components/WalletLoader'
import { useSigningClient } from '../contexts/cosmwasm'
import { ReactElement, useEffect, useState } from 'react'
import {
  convertMicroDenomToDenom,  convertFromMicroDenom
} from '../util/conversion'
import { useAlert } from 'react-alert'
import Emoji from '../components/Emoji'
import Head from 'next/head'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uconst'
const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

const Home = (): ReactElement => {
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
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="inline-block align-middle pt-20">
          <WalletLoader loading={loading}>
            <h1>
              You can mint your NFT on Archway⛩
            </h1>
            <h1>
              You can sell and buy Cosmos NFTs without market fee😍
            </h1>
            <h1>
              You can mint and burn wrapped CONST token easily👍
            </h1>
          </WalletLoader>
        </div>
    </div>
  )
}

export default Home;
