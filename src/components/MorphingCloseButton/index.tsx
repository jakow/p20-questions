import * as React from 'react';
import Button from '../Button';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const style = require('./MorphingCloseButton.pcss');
interface MorphingButtonProps {
  children?: React.ReactNode;
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
  isClose: boolean;
}

export default function MorphingButton({ isClose, onClick, children }: MorphingButtonProps) {

  function render() {
    if (isClose) 
      return <span className={style.content}><span key="close" className={style.icon} /></span>;
    else 
      return <span className={style.content} key="not-close">{children}</span>;
  }

  return (
  <Button className={isClose ? style.close : style.normal} onClick={onClick}>
    <ReactCSSTransitionGroup transitionName={style}
    transitionEnter={true}
    transitionLeave={true}
    transitionEnterTimeout={200}
    transitionLeaveTimeout={200}>
    {render()}
  </ReactCSSTransitionGroup>
  </Button>
  );
}
