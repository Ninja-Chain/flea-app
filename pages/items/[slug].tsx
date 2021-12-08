import { ReactElement, useState, useEffect, ChangeEvent } from "react"
import { useAlert } from "react-alert"
import Image from "next/image"
import { useRouter } from "next/router"
import { calculateFee } from "@cosmjs/stargate"

import { useSigningClient } from "../../contexts/cosmwasm"

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || "uconst"
const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ""
const NEXT_PUBLIC_MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE || ""
const PUBLIC_WRAPPED_TOKEN_CONTRACT =
  process.env.NEXT_PUBLIC_WRAPPED_TOKEN_CONTRACT || ""

const Item = (
  {
    // nftName,
    // nftImageUrl,
    // nftDescription,
    // nftPrice,
  }
): ReactElement => {
  const [canBuy, setCanBuy] = useState(false)
  const [canSell, setCanSell] = useState(false)
  const [canCansel, setCanCansel] = useState(false)
  const [nftName, setNftName] = useState("")
  const [nftImageUrl, setNftImageUrl] = useState("")
  const [nftDescription, setNftDescription] = useState("")
  const [nftPrice, setNftPrice] = useState("")
  const [nftSellPrice, setNftSellPrice] = useState("")
  const [nftTokenId, setNftTokenId] = useState("")
  const [offeringId, setOfferingId] = useState("")
  const alert = useAlert()
  const router = useRouter()
  const { slug } = router.query
  const { walletAddress, signingClient, connectWallet } = useSigningClient()

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      connectWallet()
      return
    }

    if (nftTokenId === "") {
      setNftTokenId(String(slug))
      return
    }

    signingClient
      .queryContractSmart(PUBLIC_CW721_CONTRACT, {
        nft_info: { token_id: nftTokenId },
      })
      .then((nftInfo) => {
        const decodedMetadata = JSON.parse(
          Buffer.from(nftInfo.token_uri.slice(30), "base64").toString()
        )
        setNftName(decodedMetadata.name)
        setNftImageUrl(decodedMetadata.image)
        setNftDescription(decodedMetadata.description)
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log("Error query nft_info: ", error)
      })

    signingClient
      .queryContractSmart(NEXT_PUBLIC_MARKETPLACE, { get_offerings: {} })
      .then((res) => {
        res.offerings.map((offer) => {
          if (offer.token_id === nftTokenId) {
            setOfferingId(offer.id)
            setNftPrice(`${offer.list_price.amount}`)
          }
        })
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log("Error query offerings: ", error)
      })

    if (nftPrice !== "") {
      // 売り注文あり
      setCanBuy(true)
    } else {
      // 売り注文なし
    }

    signingClient
      .queryContractSmart(PUBLIC_CW721_CONTRACT, {
        owner_of: { token_id: nftTokenId },
      })
      .then((res) => {
        if (res.owner === walletAddress) {
          // My NFT
          setCanSell(true)
        }
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log("Error query owner: ", error)
      })
  })

  const handleSell = async (): Promise<void> => {
    const msg = `{"list_price":{"address":"${PUBLIC_WRAPPED_TOKEN_CONTRACT}","amount":"${nftSellPrice}"}}`
    const encodedMsg = Buffer.from(msg).toString("base64")

    if (!signingClient) return

    signingClient
      ?.execute(
        walletAddress, // sender address
        PUBLIC_CW721_CONTRACT, // cw721-base contract
        {
          send_nft: {
            contract: NEXT_PUBLIC_MARKETPLACE,
            token_id: nftTokenId,
            msg: encodedMsg,
          },
        }, // msg
        calculateFee(300_000, "20uconst")
      )
      .then((res) => {
        console.log(res)
        alert.success("Successfully ordered!")
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log("Error signingClient?.execute(): ", error)
      })
  }

  const handleBuy = async (): Promise<void> => {
    const msg = `{"offering_id":"${offeringId}"}`
    const encodedMsg = Buffer.from(msg).toString("base64")

    if (!signingClient) return

    signingClient
      ?.execute(
        walletAddress, // sender address
        PUBLIC_WRAPPED_TOKEN_CONTRACT, // cw20 contract
        {
          send: {
            contract: NEXT_PUBLIC_MARKETPLACE,
            amount: nftPrice,
            msg: encodedMsg,
          },
        }, // msg
        calculateFee(600_000, "20uconst")
      )
      .then((res) => {
        console.log(res)
        alert.success("Successfully ordered!")
      })
      .catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log("Error signingClient?.execute(): ", error)
      })
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event
    setNftSellPrice(value)
  }

  return (
    <div className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <Image
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={nftImageUrl || "https://dummyimage.com/400x400"}
            height={400}
            width={400}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              NAME
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {nftName}
            </h1>
            <hr className="my-4 " />
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Description
            </h2>
            <p className="leading-relaxed">{nftDescription}</p>
            <hr className="my-4 " />
            {canBuy ? (
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {nftPrice} {PUBLIC_STAKING_DENOM}
                </span>
                <button
                  onClick={handleBuy}
                  className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded"
                >
                  Buy
                </button>
              </div>
            ) : null}
            {canSell ? (
              <div className="flex">
                <input
                  onChange={handlePriceChange}
                  placeholder="Price"
                  className=" text-black placeholder-gray-600 w-1/2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                />
                <button
                  onClick={handleSell}
                  className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 mt-2 focus:outline-none hover:bg-yellow-600 rounded"
                >
                  Sell
                </button>
              </div>
            ) : null}
            {canCansel ? (
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  {nftPrice}
                </span>
                <button className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded">
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// NOTE: ReactElement外でコントラクトとのインタラクションができなかったため未使用
// export async function getServerSideProps(context) {
//   console.log(context.params.slug)
//   const nftTokenId = context.params.slug[1]
//   // TODO: nftTokenIdを使ってコントラクトからデータを取得する
//   const nftName = "Earthen Bottle"
//   const nftImageUrl = "https://dummyimage.com/400x400"
//   const nftDescription = "Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn."
//   const nftPrice = "$58"

//   return { props: { nftName, nftImageUrl, nftDescription, nftPrice } }
// }

export default Item
