import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const MyPage = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>wCONST</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          wCONST
        </h1>
      </main>
    </div>
  )
}

export default MyPage;
