import { AppProps } from 'next/app'
import Layout from '../components/Layout';
import 'tailwindcss/tailwind.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} /> 
    </Layout>
  ) 
}

export default App
