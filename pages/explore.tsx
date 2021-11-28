import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Explore = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Explore
        </h1>
      </main>
    </div>
  )
}

export default Explore;
