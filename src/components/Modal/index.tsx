import * as React from 'react';
import Button from '../Button';
const style = require('./Modal.pcss');

export const ModalHeader = (props: React.Props<{}>) => (<header className={style.header}>{props.children}</header>);

export const ModalBody = (props: React.Props<{}>) => (<div className={style.body}>{props.children}</div>);

interface ModalCloseButtonProps {
  onClick: () => void;
}
export const ModalCloseButton = ({ onClick }: ModalCloseButtonProps) => {
  return <Button title="Close" className={style.close} onClick={onClick}><span className={style.closeIcon}/></Button>;
}
