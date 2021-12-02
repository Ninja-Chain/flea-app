import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Item = ({ item }): ReactElement => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detail</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Detail
        </h1>
      </main>
    </div>
  )
}

export default Item;
