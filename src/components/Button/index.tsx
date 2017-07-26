import * as React from 'react';
import * as classnames from 'classnames';
const style = require('./Button.pcss');

interface ButtonProps extends React.Props<ButtonProps> {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: string;
  className?: string;
  style?: 'normal' | 'transparent' | 'hollow';
}
export default function Button(props: ButtonProps) {
  const {type, onClick, children, className} = props;
  const buttonStyle = props.style || 'normal';
  if (type === 'submit' || type === 'button') {
    return (
      <button type={type} className={classnames(style.base, style[buttonStyle], props.className)} onClick={onClick}>
        {children}
      </button>
    );
  } else {
    return <a className={classnames(style.button, className)} href="#" onClick={onClick}>{children}</a>;
  }
};
