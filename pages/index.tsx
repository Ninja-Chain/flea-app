import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Home
        </h1>
      </main>
    </div>
  )
}

export default Home;
