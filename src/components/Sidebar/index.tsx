import * as React from 'react';
import Logo from '../Logo';
import Button from '../Button';
import uiStore from '../../models/UiStore';
const style = require('./Sidebar.pcss');

const Sidebar = (props: React.Props<{}>) => (
  <div className={style.sidebar}>
    <header className={style.sidebarHeader}>
    <Logo/>
    </header>
    <div className={style.sidebarMain}/>
    <footer className={style.sidebarFooter}>
      <Button onClick={() => uiStore.loginModalOpen = true}>Log in</Button>
    </footer>
  </div>
  );

export default Sidebar;