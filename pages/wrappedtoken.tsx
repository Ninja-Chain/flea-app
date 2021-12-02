import { ReactElement, useEffect, useState } from 'react'
import { useSigningClient } from '../contexts/cosmwasm'
import WalletLoader from '../components/WalletLoader'
import Emoji from '../components/Emoji'
import {
  convertMicroDenomToDenom,  convertFromMicroDenom
} from '../util/conversion'
import { useAlert } from 'react-alert'

import Head from 'next/head'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uconst'
const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

const WrappedToken = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [balance, setBalance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
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

  return (
    <div>
      <Head>
        <title>Wrapped CONST</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <WalletLoader loading={loading}>
          {balance && (
            <p className="text-primary">
              <span>{`Your wallet has ${balance} `}</span>
              <Emoji label="dog2" symbol="🐕" />
            </p>
          )}
        </WalletLoader>
      </main>
    </div>
  )
}

export default WrappedToken;
