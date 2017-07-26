import * as React from 'react';
const style = require('./Modal.pcss');

export const ModalHeader = (props: React.Props<{}>) => (<header className={style.header}>{props.children}</header>);

export const ModalBody = (props: React.Props<{}>) => (<div className={style.body}>{props.children}</div>);
