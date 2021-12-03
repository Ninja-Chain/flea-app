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
const PUBLIC_WRAPPED_TOKEN_CONTRACT = process.env.NEXT_PUBLIC_WRAPPED_TOKEN_CONTRACT || ''

const WrappedToken = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [nativeBalance, setNativeBalance] = useState('')
  const [wrappedBalance, setWrappedBalance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [purchaseAmount, setPurchaseAmount] = useState<any>('')
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const alert = useAlert()

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) return

    // Gets native balance (i.e. Archway balance)
    signingClient.getBalance(walletAddress, PUBLIC_STAKING_DENOM).then((response: any) => {
      const { amount, denom }: { amount: number; denom: string } = response
      setNativeBalance(`${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`)
      setWalletAmount(convertMicroDenomToDenom(amount))
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.getBalance(): ', error)
    })
  }, [signingClient, walletAddress, loadedAt, alert])

  useEffect(() => {
    if (!signingClient) return

    console.log(PUBLIC_WRAPPED_TOKEN_CONTRACT)

    // Gets token information
    signingClient.queryContractSmart(PUBLIC_WRAPPED_TOKEN_CONTRACT, {"balance":{"address":"yourwalletaddress"}}).then((response) => {
      console.log(response)
      setWrappedBalance(response.balance);
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() token_info: ', error)
    })
  }, [signingClient, alert])

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { target: { value } } = event
  //   setPurchaseAmount(value)
  // }

  // const handlePurchase = (event: MouseEvent<HTMLElement>) => {
  //   if (!signingClient || walletAddress.length === 0) return
  //   if (!purchaseAmount) {
  //     alert.error('Please enter the amount you would like to purchase')
  //     return
  //   }
  //   if (purchaseAmount > walletAmount) {
  //     alert.error(`You do not have enough tokens to make this purchase, maximum you can spend is ${walletAmount}`)
  //     return
  //   }

  //   event.preventDefault()
  //   setLoading(true)

  //   signingClient?.execute(
  //     walletAddress, // sender address
  //     PUBLIC__WRAPPED＿TOKEN＿CONTRACT, // token sale contract
  //     { buy: {} }, // msg
  //     undefined,
  //     [coin(parseInt(convertDenomToMicroDenom(purchaseAmount), 10), 'ujuno')]
  //   ).then((response) => {
  //     setPurchaseAmount('')
  //     setLoadedAt(new Date())
  //     setLoading(false)
  //     alert.success('Successfully purchased!')
  //   }).catch((error) => {
  //     setLoading(false)
  //     alert.error(`Error! ${error.message}`)
  //     console.log('Error signingClient?.execute(): ', error)
  //   })
  // }

  return (
    <div>
      <Head>
        <title>Wrapped CONST</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <WalletLoader loading={loading}>
          {nativeBalance && (
            <p className="text-primary">
              <span>{`Your wallet has ${nativeBalance} `}</span>
              <Emoji label="dog2" symbol="🐕" />
            </p>
          )}
          {wrappedBalance && (
            <p className="text-primary">
              <span>{`Your wallet has ${wrappedBalance} wCONST `}</span>
              <Emoji label="dog2" symbol="🐕" />
            </p>
          )}
          {/* <div className="form-control">
            <div className="relative">
              <input
                type="number"
                id="purchase-amount"
                placeholder="Amount"
                step="0.1"
                className="w-full input input-lg input-primary input-bordered font-mono"
                onChange={handleChange}
                value={purchaseAmount}
                style={{ paddingRight: '10rem' }}
              />
              <button
                className="absolute top-0 right-0 rounded-l-none btn btn-lg btn-primary"
                onClick={handlePurchase}
              >
                purchase
              </button>
            </div>
          </div> */}
        </WalletLoader>
      </main>
    </div>
  )
}

export default WrappedToken;
