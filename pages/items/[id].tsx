import { ReactElement } from 'react';

import Head from 'next/head'

const Item = ({ item }): ReactElement => {
  return (
    <div>
      <Head>
        <title>Detail</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Detail
        </h1>
      </main>
    </div>
  )
}

export default Item;
