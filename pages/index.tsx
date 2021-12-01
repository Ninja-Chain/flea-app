import { ReactElement } from 'react';

import Head from 'next/head'

const Home = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Home
        </h1>
      </main>
    </div>
  )
}

export default Home;
