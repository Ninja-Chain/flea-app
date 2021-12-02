import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Explore = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>Explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Explore
        </h1>
      </main>
    </div>
  )
}

export default Explore;
