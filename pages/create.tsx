import { ReactElement, useState, useEffect, ChangeEvent } from 'react';
import { Buffer } from 'buffer'
import Head from 'next/head'
import WalletLoader from '../components/WalletLoader'
import { useSigningClient } from '../contexts/cosmwasm'
import { useAlert } from 'react-alert'
import { calculateFee } from "@cosmjs/stargate";

const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

const Create = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [loading, setLoading] = useState(false)
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [nftName, setNftName] = useState<string>('')
  const [nftImageUrl, setNftImageUrl] = useState<string>('')
  const [nftDescription, setNftDescription] = useState<string>('')
  const [nftTokenId, setNftTokenId] = useState(0)
  const alert = useAlert()

  useEffect(() => {
    if (!signingClient) return

    // Gets minted NFT amount
    signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {"num_tokens":{}}).then((response) => {
      setNftTokenId(response.count+1);
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() num_tokens: ', error)
    })
  }, [signingClient, alert])

  const handleMint = async (): Promise<void> => {
    const metadata = `{"name": "${nftName}", "description": "${nftDescription}", "image": "${nftImageUrl}"}`
    const encodedMetadata = Buffer.from(metadata).toString('base64')
    console.log(`{"name": ${nftName}, "description": "${nftDescription}", "image": "${nftImageUrl}"}`)
    console.log(`data:application/json;base64, ${encodedMetadata}`)

    if (!signingClient) return

    signingClient?.execute(
      walletAddress, // sender address
      PUBLIC_CW721_CONTRACT, // cw721-base contract
      {mint:{token_id:nftTokenId.toString(), owner:`${walletAddress}`,token_uri:`data:application/json;base64, ${encodedMetadata}`}}, // msg
      calculateFee(300_000, "20uconst")
    ).then((response) => {
      console.log(response)
      setNftTokenId(nftTokenId+1);
      setLoading(false)
      alert.success('Successfully minted!')
    }).catch((error) => {
      setLoading(false)
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient?.execute(): ', error)
    })
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setNftName(value)
  }

  const handleImageUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setNftImageUrl(value)
  }

  const handleDescriptiopnChange = (event) => {
    setNftDescription(event.target.value)
  }

  return (
    <div className="w-1/3">
      <Head>
        <title>Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletLoader loading={false}>
        <main>
          <div className="inline-block align-middle pt-20 w-full">
            <h1>
              Create Your NFT
            </h1>
            <form className="w-full max-w-sm">
              <div className="py-4">
                <p>Name</p>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input onChange={handleNameChange} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Favorite Name" aria-label="Full name" />
                </div>
              </div>
              <div className="py-4">
                <p>Image URL</p>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input onChange={handleImageUrlChange} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="http://www.example.image.com" aria-label="Full name" />
                </div>
              </div>
              <div className="py-4">
                <p>Description</p>
                <div className="flex items-center border-b border-teal-500 py-2">
                  <textarea value={nftDescription} onChange={handleDescriptiopnChange} className="form-textarea mt-1 block w-full" placeholder="Enter your NFT description." />
                </div>
              </div>
              <div className="w-auto item-center">
                <button onClick={handleMint} className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2" type="button">Mint</button>
              </div>
            </form>
          </div>
        </main>
      </WalletLoader>
    </div>
  )
}

export default Create;
