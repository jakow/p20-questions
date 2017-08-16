import * as React from 'react';
import {inject} from 'mobx-react';
import {UiService} from '../../services/UiService';
import Logo from '../Logo';
import Button from '../Button';
const style = require('./Sidebar.pcss');

interface SidebarProps extends React.Props<SidebarProps> {
  uiStore?: UiService;
}
const Sidebar = inject('uiStore')(({uiStore}: SidebarProps) => (
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
  ));

export default Sidebar;