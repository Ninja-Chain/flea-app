import { ReactElement } from 'react';

import Head from 'next/head'

const MyPage = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>My Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          My Page
        </h1>
      </main>
    </div>
  )
}

export default MyPage;
