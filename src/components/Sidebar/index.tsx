import * as React from 'react';
import './Sidebar.css';

const Sidebar = (props: React.Props<{}>) => (
  <div className="sidebar">
    {props.children}
  </div>
  );

export default Sidebar;