import { ReactElement, useEffect, useState, ChangeEvent } from 'react'
import { useSigningClient } from '../contexts/cosmwasm'
import WalletLoader from '../components/WalletLoader'
import Emoji from '../components/Emoji'
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from '../util/conversion'
import { useAlert } from 'react-alert'
import Head from 'next/head'
import { calculateFee } from "@cosmjs/stargate";

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uconst'
const PUBLIC_WRAPPED_TOKEN_CONTRACT = process.env.NEXT_PUBLIC_WRAPPED_TOKEN_CONTRACT || ''

const WrappedToken = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [nativeBalance, setNativeBalance] = useState('')
  const [wrappedBalance, setWrappedBalance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [purchaseWrappedAmount, setPurchaseWrappedAmount] = useState<any>('')
  const [purchaseUnwrappedAmount, setPurchaseUnwrappedAmount] = useState<any>('')
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
    if (!signingClient || walletAddress.length === 0) return

    // Gets token balance
    signingClient.queryContractSmart(PUBLIC_WRAPPED_TOKEN_CONTRACT, {"balance":{"address": walletAddress}}).then((response) => {
      setWrappedBalance(response.balance);
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() balance: ', error)
    })
  }, [signingClient, alert])

  const handleWrappedAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setPurchaseWrappedAmount(value)
  }

  const handleUnwrappedAmount= (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setPurchaseUnwrappedAmount(value)
  }

  const handlePurchaseWrapped = async (): Promise<void> => {
    if (!signingClient) return

    signingClient?.execute(
      walletAddress, // sender address
      PUBLIC_WRAPPED_TOKEN_CONTRACT, // wrapped token contract
      {deposit:{}}, // msg
      calculateFee(300_000, "20uconst"), //fee
      undefined, //memo
      [{amount: purchaseWrappedAmount, denom: "uconst"}] //funds
    ).then((response) => {
      console.log(response)
      setPurchaseWrappedAmount("")
      setLoading(false)
      alert.success('Successfully get wrapped token!')
    }).catch((error) => {
      setLoading(false)
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient?.execute(): ', error)
    })
  };

  const handlePurchaseUnwrapped = async (): Promise<void> => {
    if (!signingClient) return

    signingClient?.execute(
      walletAddress, // sender address
      PUBLIC_WRAPPED_TOKEN_CONTRACT, // wrapped token contract
      {withdraw:{ amount: purchaseUnwrappedAmount}}, // msg
      calculateFee(300_000, "20uconst") //fee
    ).then((response) => {
      console.log(response)
      setPurchaseUnwrappedAmount("")
      setLoading(false)
      alert.success('Successfully unwrapped token!')
    }).catch((error) => {
      setLoading(false)
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient?.execute(): ', error)
    })
  };

  return (
    <div className="w-1/3">
      <Head>
        <title>wCONST</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="inline-block align-middle pt-20">
          <h1>
            wCONST
          </h1>
          <WalletLoader loading={loading}>
            <div className="py-4">
              <p className="text-primary">
                <span>{`Your wallet has ${nativeBalance || "0 CONST"} `}</span>
                <Emoji label="cat2" symbol="🐈" />
              </p>
              {wrappedBalance && <p className="text-primary">
                <span>{`Your wallet has ${wrappedBalance || 0} wCONST `}</span>
                <Emoji label="cat2" symbol="🐈" />
              </p>}
            </div>
            <h2>CONST to wCONST</h2>
            <div className="form-control">
              <div className="relative">
              <input type="number" onChange={handleWrappedAmount} placeholder="number...." className="border border-gray-300 p-2 m-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200" />
              <button onClick={handlePurchaseWrapped} className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Convert</button>
              </div>
            </div>
            <h2> wCONST to CONST</h2>
            <div className="form-control">
              <div className="relative">
              <input type="number" onChange={handleUnwrappedAmount} placeholder="number...." className="border border-gray-300 p-2 m-2 rounded-md focus:outline-none focus:ring-2 ring-blue-200" />
              <button onClick={handlePurchaseUnwrapped} className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Convert</button>
              </div>
            </div>
          </WalletLoader>
        </div>
      </main>
    </div>
  )
}

export default WrappedToken;
