import { ReactElement, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { Buffer } from 'buffer'
import Head from 'next/head'
import WalletLoader from '../components/WalletLoader'
import { useSigningClient } from '../contexts/cosmwasm'
import { useAlert } from 'react-alert'
import { calculateFee, GasPrice } from "@cosmjs/stargate";

const PUBLIC_CW721_CONTRACT = process.env.NEXT_PUBLIC_CW721_CONTRACT || ''

const items = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '/items/1',
    price: '$48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '/items/2',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
  },
]

var nfts: any[] = new Array();

const MyPage = (): ReactElement => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient()
  const [nftAmount, setNftAmount] = useState<number>()
  const alert = useAlert()

  async function fetch_nft_info(i: number) {
    await signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {"nft_info":{"token_id": i.toString()}}).then(async (res) => {
      console.log("nft_infoまできてる")
      console.log(res.token_uri.split(',')[1])
      console.log(Buffer.from(res.token_uri.split(',')[1], 'base64').toString())
      const decodedMetadata = await JSON.parse(Buffer.from(res.token_uri.split(',')[1], 'base64').toString())
      console.log(decodedMetadata)
      await nfts.push(  {
        id: i,
        name: decodedMetadata.name,
        href: `items/${i}`,
        imageSrc: decodedMetadata.image,
      });
      return
    })
  }

  async function fetch_owner_of(i: number) {
    try {
      await signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {"owner_of":{"token_id": i.toString()}}).then(async (response) => {
        console.log(response.owner)
        if (response.owner == walletAddress) {
          await fetch_nft_info(i)
        }
        return
      }).catch((error) => {
        console.log("owner_ofでエラー")
        console.log(error);
      })
    }
    catch(err) {
        console.log('Error: ', err.message);
    }
  }

  async function fetch_num_token() {
    try {
      await signingClient.queryContractSmart(PUBLIC_CW721_CONTRACT, {"num_tokens":{}}).then(async (response) => {
        console.log(response.count);
        await setNftAmount(response.count);
        for (var i = 1; i < nftAmount+1; i++) {
          await fetch_owner_of(i)
        }
      }).catch((error) => {
        alert.error(`Error! ${error.message}`)
        console.log('Error signingClient.queryContractSmart() num_tokens: ', error)
      })
    }
    catch(err) {
        console.log('Error: ', err.message);
    }
  }

  useEffect(() => {
    if (!signingClient) return

    fetch_num_token()
  }, [signingClient, alert])

  return (
    <div className="w-full">
      <main className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1>My Page: My NFT</h1>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 py-4">
            {nfts.map((item) => (
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
                  <p className="mt-1 text-lg font-medium text-gray-900">{item.price}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyPage;
