import { ReactElement } from 'react';
import Sidebar from './Sidebar'

const Layout = ({ children }): ReactElement => {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}

export default Layout;
