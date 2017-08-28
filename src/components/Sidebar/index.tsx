import * as React from 'react';
import { inject } from 'mobx-react';
import UiStore from '../../services/UiStore';
import Logo from '../Logo';
import Button from '../Button';
// import { Collapse } from 'react-collapse';
import CurrentEventView from '../../containers/CurrentEventView';
const style = require('./Sidebar.pcss');

interface SidebarProps extends React.Props<SidebarProps> {
  uiStore?: UiStore;
}


// tslint:disable-next-line:variable-name
const Sidebar = inject('uiStore')( ({uiStore}: SidebarProps) => (
  <aside className={style.sidebar}>
    <header className={style.header}>
    <Logo/>
    {/* <MenuButton onClick={}/> */}
    </header>
    <div className={style.content}>
      {/* <Collapse isOpened={true}> */}
        <CurrentEventView/>
      {/* </Collapse> */}
    </div>
    <footer className={style.footer}>
      {/* tslint:disable jsx-no-lambda*/}
      <Button style="transparent" onClick={() => uiStore.loginModalOpen = true}>Log in</Button> 
      <Button style="transparent" onClick={() => uiStore.aboutModalOpen = true}>About</Button> 
    </footer>
  </aside>
));
export default Sidebar;
