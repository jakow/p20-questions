import * as React from 'react';
const style = require('./Button.pcss');

interface ButtonProps extends React.Props<ButtonProps> {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onSubmit?: (ev: React.FormEvent<HTMLButtonElement>) => void;
  type?: string;
  className?: string;
  style?: 'normal' | 'transparent' | 'hollow';
}
export default function Button(props: ButtonProps) {
  const {type, onClick, onSubmit, children, className} = props;
  const buttonStyle = props.style || 'normal';
  if (type === 'submit' || type === 'button') {
    return (
      <button type={type} className={className || style[buttonStyle]} onClick={onClick} 
      onSubmit={onSubmit}>
        {children}
      </button>
    );
  } else {
    return <a className={className || style[buttonStyle]} href="#" onClick={onClick}>{children}</a>;
  }
};
