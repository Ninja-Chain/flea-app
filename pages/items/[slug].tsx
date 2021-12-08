import { ReactElement, useState } from 'react';

import Image from 'next/image'

const Item = ({ nftName, nftImageUrl, nftDescription, nftPrice }): ReactElement => {
  const [canBuy, setCanBuy] = useState(false)
  const [canSell, setCanSell] = useState(false)
  const [canCansel, setCanCansel] = useState(false)

  return (
    <div className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <Image
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={nftImageUrl}
            height={400}
            width={400}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">NAME</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{nftName}</h1>
            <hr className="my-4 "/>
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Description</h2>
            <p className="leading-relaxed">{nftDescription}</p>
            <hr className="my-4 "/>
            { canBuy ?
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">{nftPrice}</span>
                <button className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded">Buy</button>
              </div>
            : null }
            { canSell ?
              <div className="flex">
                <input placeholder="Price" className=" text-black placeholder-gray-600 w-1/2 px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"/>
                <button className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 mt-2 focus:outline-none hover:bg-yellow-600 rounded">Sell</button>
              </div>
            : null }
            { canCansel ?
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">{nftPrice}</span>
                <button className="flex ml-auto text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded">Cancel</button>
              </div>
            : null }
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  console.log(context.params.slug)
  const nftTokenId = context.params.slug[1]
  // TODO: nftTokenIdを使ってコントラクトからデータを取得する
  const nftName = "Earthen Bottle"
  const nftImageUrl = "https://dummyimage.com/400x400"
  const nftDescription = "Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn."
  const nftPrice = "$58"

  return { props: { nftName, nftImageUrl, nftDescription, nftPrice } }
}


export default Item;
