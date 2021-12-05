import { useSigningClient } from '../contexts/cosmwasm'
import Link from 'next/link'
import Image from 'next/image'
import Emoji from './Emoji'

function Nav() {
  const { walletAddress, connectWallet, disconnect } = useSigningClient()
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
    }
  }

  return (
    <div className="border-b w-full px-2 md:px-16 bg-yellow-400">
      <nav className="flex flex-wrap text-center md:text-right md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
          <button
            className="block btn btn-outline btn-primary w-full max-w-full truncate"
            onClick={handleConnect}
          >
            {walletAddress || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
