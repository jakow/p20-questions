import * as React from 'react';
import Modal from 'react-modal';
import * as classnames from 'classnames';
import {observer} from 'mobx-react';
import uiStore from '../../models/UiStore';
import apiStore from '../../models/ApiStore';
import {ModalHeader, ModalBody} from '../../components/Modal';
const coreStyle = require('../../components/Modal/Modal.pcss');
const style = require('./LoginModal.pcss');
import Input from '../../components/Input';
import Button from '../../components/Button';

Modal.setAppElement(document.getElementById('app') as HTMLElement);

@observer
export default class LoginModal extends React.Component<null, null> {
  render() {
    return (
      <Modal isOpen={uiStore.loginModalOpen} 
      contentLabel="login modal"
      overlayClassName={{
        base: coreStyle.overlay,
        afterOpen: coreStyle.overlay_afterOpen,
        beforeClose: coreStyle.overlay_beforeClose,
      }}
      className={{
        base: classnames(coreStyle.modal, style.loginModal),
        afterOpen: coreStyle.modal_afterOpen,
        beforeClose: coreStyle.modal_beforeClose,
      }}
      shouldCloseOnOverlayClick={true}
      onRequestClose={(() => uiStore.loginModalOpen = false)}
      closeTimeoutMS={200}>
      <ModalHeader>Log in to Questions</ModalHeader>
      <ModalBody>
        <form id="login-form" method="post" onSubmit={(ev) => this.onSubmit(ev)}> 
          <Input type="text" id="username" label="Username" 
            onChange={(e) => apiStore.username = e.target.value}/> 
          <Input type="password" id="password" label="Password" 
            onChange={(e) => apiStore.password = e.target.value}/> 
          <Button style="normal" type="submit">Log in</Button> 
        </form> 
      </ModalBody>
    </Modal>
    );
  }

  async onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const error = await apiStore.login();
    if (!error) {
      uiStore.loginModalOpen = false;
    } else {
      console.error(error);
    }
  }
}