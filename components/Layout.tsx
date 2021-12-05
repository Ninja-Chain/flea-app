import { ReactElement } from 'react';
import Sidebar from './Sidebar'
import Nav from "./Nav"

const Layout = ({ children }): ReactElement => {
  return (
    <div className="flex">
      <div className="flex w-1/6 min-h-screen bg-base-100">
        <Sidebar />
      </div>
      <main className="flex flex-col items-center flex-1 w-5/6">
        <Nav />
        {children}
      </main>
    </div>
  )
}

export default Layout;
