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
        <title>wCONST</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="inline-block align-middle pt-20">
          <h1>
            wCONST
          </h1>
          {/* <WalletLoader loading={loading}> */}
            <div className="py-4">
              <p className="text-primary">
                <span>{`Your wallet has ${nativeBalance} CONST `}</span>
                <Emoji label="cat2" symbol="🐈" />
              </p>
              <p className="text-primary">
                <span>{`Your wallet has ${wrappedBalance} wCONST `}</span>
                <Emoji label="cat2" symbol="🐈" />
              </p>
            </div>
            <h2>CONST to wCONST</h2>
            <div className="form-control">
              <div className="relative">
              <input type="number" placeholder="number...." className="border border-gray-300 p-2 m-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200" />
              <button className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Convert</button>
              </div>
            </div>
            <h2> wCONST to CONST</h2>
            <div className="form-control">
              <div className="relative">
              <input type="number" placeholder="number...." className="border border-gray-300 p-2 m-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200" />
              <button className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Convert</button>
              </div>
            </div>
          {/* </WalletLoader> */}
        </div>
      </main>
    </div>
  )
}

export default WrappedToken;
