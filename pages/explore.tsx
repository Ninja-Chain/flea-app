import { Buffer } from "buffer"

import Image from "next/image"
import Link from "next/link"
import { ReactElement, useEffect, useState } from "react"
import { useAlert } from "react-alert"

import { useSigningClient } from "../contexts/cosmwasm"

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || "uconst"
const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ""
const PUBLIC_WRAPPED_TOKEN_CONTRACT =
  process.env.NEXT_PUBLIC_WRAPPED_TOKEN_CONTRACT || ""
const PUBLIC_MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE || ""

const Explore = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [Nft, setNft] = useState([])
  const alert = useAlert()

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      connectWallet()
      return
    }

    signingClient
      .queryContractSmart(PUBLIC_CW721_CONTRACT, { num_tokens: {} })
      .then((res) => {
        console.log(`number of tokens: ${res.count}`)
        const promises = []
        for (let i = 1; i <= res.count; i++) {
          promises.push(
            signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {
              nft_info: { token_id: i + "" },
            })
          )
        }
        Promise.all(promises)
          .then((res) => {
            const items = res.map(async (token, i) => {
              const decodedMetadata = JSON.parse(
                Buffer.from(token.token_uri.slice(30), "base64").toString()
              )

              let price = 0
              const query = await signingClient.queryContractSmart(
                PUBLIC_MARKETPLACE,
                { get_offerings: {} }
              )
              const b = query.offerings.forEach((offer) => {
                if (offer.token_id === `${i + 1}`) {
                  price += Number(offer.list_price.amount) /1000000
                }
              })

              return {
                id: i + 1,
                name: decodedMetadata.name,
                href: `/items/${i + 1}`,
                price: `${price} CONST`,
                imageSrc:
                  decodedMetadata.image || "https://dummyimage.com/400x400",
              }
            })

            return items
          })
          .then(async (res) => {
            Promise.all(res).then((items) => {
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
  }, [signingClient, walletAddress, alert])

  return (
    <div className="w-full">
      <main className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {Nft.map((item) => (
              <Link key={item.id} href={item.href}>
                <a className="group">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <Image
                      src={item.imageSrc}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                      layout="fill"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {(item.price != "0 CONST") && item.price}
                  </p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Explore
