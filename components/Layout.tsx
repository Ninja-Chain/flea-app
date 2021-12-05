import { ReactElement } from 'react';
import Sidebar from './Sidebar'
import Nav from "./Nav"

const Layout = ({ children }): ReactElement => {
  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />
      <main className="flex flex-col items-center flex-1 text-center">
        <Nav />
        {children}
      </main>
    </div>
  )
}

export default Layout;
