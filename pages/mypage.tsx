import { ReactElement, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { Buffer } from 'buffer'
import WalletLoader from '../components/WalletLoader'
import { useSigningClient } from '../contexts/cosmwasm'
import { useAlert } from 'react-alert'

const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

const MyPage = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [Nft, setNft] = useState([])
  const [loading, setLoading] = useState(false)
  const alert = useAlert()

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      connectWallet()
      return
    }

    signingClient
      .queryContractSmart(PUBLIC_CW721_CONTRACT, { num_tokens: {} })
      .then((res) => {
        const owned = []
        const promises = []
        for (let i = 1; i <= res.count; i++) {
          console.log(i)
          owned.push(
            signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, { owner_of: { token_id: i + ""}})
          )
        }
        Promise.all(owned).then((res) => {
          for (let i = 0; i < res.length; i++) {
            if(res[i].owner == walletAddress) {
              promises.push(
                signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {
                  nft_info: { token_id: (i + 1).toString() },
                })
              )
            }
          }
          Promise.all(promises).then((res) => {
            const items = res.map((token, i) => {
              console.log(Buffer.from(token.token_uri.slice(30), "base64").toString())
              const decodedMetadata = JSON.parse(
                Buffer.from(token.token_uri.slice(30), "base64").toString()
              )
              console.log(decodedMetadata)

              return {
                id: i + 1,
                name: decodedMetadata.name,
                href: `/items/${i + 1}`,
                imageSrc:
                  decodedMetadata.image || "https://dummyimage.com/400x400",
              }
            })
            setNft(items)
          })
        })
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log(
          "Error signingClient.queryContractSmart() num_tokens: ",
          error
        )
      })
  }, [signingClient, alert])

  return (
    <div className="inline-block align-middle pt-20">
      <WalletLoader loading={loading}>
        <main className="bg-white">
          <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1>My Page: My NFT</h1>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 py-4">
              {Nft.map((item) => (
                <Link key={item.id} href={item.href} >
                  <a className="group">
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                      <Image
                        src={item.imageSrc}
                        className="w-full h-full object-center object-cover group-hover:opacity-75"
                        layout="fill"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </WalletLoader>
    </div>
  )
}

export default MyPage;
