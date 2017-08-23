import * as React from 'react';
import Modal from 'react-modal';
import * as classnames from 'classnames';
import {observer, inject} from 'mobx-react';
import UiStore from '../../services/UiStore';
import ApiStore from '../../services/ApiStore';
import {ModalHeader, ModalBody} from '../../components/Modal';
const coreStyle = require('../../components/Modal/Modal.pcss');
const style = require('./LoginModal.pcss');
import Input from '../../components/Input';
import Button from '../../components/Button';

Modal.setAppElement(document.getElementById('app') as HTMLElement);

interface LoginModalProps {
  uiStore?: UiStore;
  apiStore?: ApiStore;
}

@inject('uiStore', 'apiStore')
@observer
export default class LoginModal extends React.Component<LoginModalProps, null> {
  onInputChange = (value: string, field: string) => {
    if (field === 'username') {
      this.props.apiStore.username = value;
    } else {
      this.props.apiStore.password = value;
    }
  }
  
  render() {
    const {uiStore, apiStore} = this.props;
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
          <Input
            autoFocus={true}  
            name="username"
            type="email" 
            id="login-username" 
            label="Username" 
            value={apiStore.username}
            onChange={this.onInputChange}/> 
          <Input 
            type="password"
            id="login-password"
            label="Password"
            name="password"
            value={apiStore.password}
            onChange={this.onInputChange}/> 
          <Button style="normal" type="submit">Log in</Button>
          <div className={style.errors}>{apiStore.loginError}</div>
        </form>
      </ModalBody>
    </Modal>
    );
  }

  async onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const {uiStore, apiStore} = this.props;
    const error = await apiStore.login(apiStore.username, apiStore.password);
    if (!error) {
      uiStore.loginModalOpen = false;
    }
  }
}