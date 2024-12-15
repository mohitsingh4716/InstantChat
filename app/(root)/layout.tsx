import SidebarWraper from '@/components/shared/sidebar/SidebarWraper'
import React from 'react'

type Props = React.PropsWithChildren<{children: React.ReactNode}>

const Layout = ({children}: Props) => {
  return  <SidebarWraper>{children}</SidebarWraper>
  
};

export default Layout;