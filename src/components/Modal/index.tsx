import * as React from 'react';
import ReactModal from 'react-modal';
import Button from '../Button';
const modalStyle = require('./Modal.pcss');
const overlayStyle = require('./Overlay.pcss');

export const ModalHeader = (props: React.Props<{}>) => 
  (<header className={modalStyle.header}>{props.children}</header>);

export const ModalBody = (props: React.Props<{}>) => (<div className={modalStyle.body}>{props.children}</div>);

interface ModalCloseButtonProps {
  onClick: () => void;
}

export const ModalCloseButton = ({ onClick }: ModalCloseButtonProps) => {
  return (
    <Button title="Close" className={modalStyle.close} onClick={onClick}>
      <span className={modalStyle.closeIcon}/>
    </Button>);
};

interface ModalProps extends React.Props<{}> {
  isOpen: boolean;
  requestClose: () => void;
  label?: string;
}

ReactModal.setAppElement(document.getElementById('app') as HTMLElement);

export default class Modal extends React.Component<ModalProps, null> {
  render() {
    return (
    <ReactModal
     onRequestClose={this.props.requestClose}
     isOpen={this.props.isOpen}
     className={modalStyle}
     overlayClassName={overlayStyle}
     shouldCloseOnOverlayClick={true}
     closeTimeoutMS={200}
     contentLabel={this.props.label || ''}
     >
      <ModalCloseButton onClick={this.props.requestClose} />
        {this.props.children}
     </ReactModal>
     );
  }
}
