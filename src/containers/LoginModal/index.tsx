import * as React from 'react';
import Modal from '../../components/Modal';
import {observer, inject} from 'mobx-react';
import UiStore from '../../services/UiStore';
import ApiStore from '../../services/ApiStore';
import {ModalHeader, ModalBody} from '../../components/Modal';
const style = require('./LoginModal.pcss');
import Input from '../../components/Input';
import Button from '../../components/Button';

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

  close = () => {
    this.props.uiStore.loginModalOpen = false;
  }
  
  render() {
    const {uiStore, apiStore} = this.props;
    return (
      
      <Modal isOpen={uiStore.loginModalOpen} 
        label="login modal"
        requestClose={this.close}
        >
        <ModalHeader>Log in to Questions</ModalHeader>
        <ModalBody>
          <form id="login-form" method="post" onSubmit={this.onSubmit}> 
            <Input
              autoFocus={true}  
              name="username"
              type="email" 
              id="login-username" 
              label="Username" 
              value={apiStore.username}
              onChange={this.onInputChange}
              /> 
            <Input 
              type="password"
              id="login-password"
              label="Password"
              name="password"
              value={apiStore.password}
              onChange={this.onInputChange}
              /> 
            <Button style="normal" type="submit">Log in</Button>
            <div className={style.errors}>{apiStore.loginError}</div>
          </form>
        </ModalBody>
      </Modal>
    );
  }

  onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const { apiStore } = this.props;
    const error = await apiStore.login(apiStore.username, apiStore.password);
    if (!error) {
      this.close();
    }
  }
}
