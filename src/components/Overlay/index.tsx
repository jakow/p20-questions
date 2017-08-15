import * as React from 'react';
import * as ReactCssTransitionGroup from 'react-addons-css-transition-group';
const style = require('./Overlay.pcss');

interface OverlayProps {
  show: boolean;
  children?: React.ReactNode;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

export default function Overlay({show, children, onClick, className}: OverlayProps) {
  return (
  <ReactCssTransitionGroup
  transitionName={style}
  transitionEnter={true}
  transitionEnterTimeout={400}
  transitionLeave={true}
  transitionLeaveTimeout={400}
  transitionAppear={true}
  transitionAppearTimeout={400}
  >
    {show ? (
      <div key="overlay" 
      className={className || style.overlay}
      onClick={onClick}>
      {children || null}
      </div>
      ) : null}
  </ReactCssTransitionGroup>
  );

}