import * as React from 'react';
import Logo from '../Logo';
import Button from '../Button';
import uiStore from '../../models/UiStore';
const style = require('./Sidebar.pcss');

const Sidebar = (props: React.Props<{}>) => (
  <aside className={style.sidebar}>
    <header className={style.header}>
    <Logo/>
    {/* <MenuButton onClick={}/> */}
    </header>
    <div className={style.content}/>
    <footer className={style.footer}>
      <Button style="transparent" onClick={() => uiStore.loginModalOpen = true}>Log in</Button>
    </footer>
  </aside>
  );

export default Sidebar;