import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const MyPage = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          My Page
        </h1>
      </main>
    </div>
  )
}

export default MyPage;
