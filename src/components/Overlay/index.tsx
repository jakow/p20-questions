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
  transitionEnterTimeout={150}
  transitionLeave={true}
  transitionLeaveTimeout={150}
  transitionAppear={true}
  transitionAppearTimeout={150}
  >
    { /* tslint:disable-next-line:jsx-no-multiline-js */
      show ? (
      <div key="overlay" className={className || style.overlay} onClick={onClick}>
        {children || null}
      </div>) : null
    }
  </ReactCssTransitionGroup>
  );
}
