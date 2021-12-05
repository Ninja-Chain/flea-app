import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Wrapped = (): ReactElement => {
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
        </div>
      </main>
    </div>
  )
}

export default Wrapped;
