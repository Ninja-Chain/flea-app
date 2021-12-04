import { ReactElement } from 'react';

import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Create = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Create
        </h1>
      </main>
    </div>
  )
}

export default Create;
