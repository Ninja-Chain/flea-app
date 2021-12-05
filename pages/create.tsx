import { ReactElement } from 'react';

import Head from 'next/head'

const Create = (): ReactElement => {
  return (
    <div className="w-1/3">
      <Head>
        <title>Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="inline-block align-middle pt-20 w-full">
          <h1>
            Create Your NFT
          </h1>
          <form className="w-full max-w-sm">
            <div className="py-4">
              <p>Name</p>
              <div className="flex items-center border-b border-teal-500 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Favorite Name" aria-label="Full name" />
              </div>
            </div>
            <div className="py-4">
              <p>Image URL</p>
              <div className="flex items-center border-b border-teal-500 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="http://www.example.image.com" aria-label="Full name" />
              </div>
            </div>
            <div className="w-auto item-center">
              <button className="p-2 my-2 bg-yellow-600 text-white rounded-md focus:outline-none focus:ring-2 ring-yellow-300 ring-offset-2">Mint</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Create;
