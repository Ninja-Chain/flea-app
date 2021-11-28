import { AppProps } from 'next/app'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { SigningCosmWasmProvider } from '../contexts/cosmwasm'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from '../components/AlertTemplate'

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.SCALE,
  containerStyle: { zIndex: 1040 }
}

function App({ Component, pageProps }: AppProps) {
  return (
    <SigningCosmWasmProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AlertProvider>
    </SigningCosmWasmProvider>
  )
}

export default App
