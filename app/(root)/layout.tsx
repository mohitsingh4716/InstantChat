import SidebarWraper from '@/components/shared/sidebar/SidebarWraper'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const Layout = ({children}: Props) => {
  return  <SidebarWraper>{children}</SidebarWraper>
  
};

export default Layout;