import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Modal from '../../components/Modal';


import UiStore from '../../services/UiStore';
import AboutModalContent from '../../components/AboutModalContent';
import { ModalBody } from '../../components/Modal';


interface AboutModalProps extends React.Props<AboutModalProps> {
  uiStore?: UiStore;
}

@inject('uiStore')
@observer
export default class AboutModal extends React.Component<AboutModalProps, null> {
  close = () => {
    this.props.uiStore.aboutModalOpen = false;
  }

  render() {
    return (
      <Modal 
      isOpen={this.props.uiStore.aboutModalOpen} 
      label="About"
      requestClose={this.close}
      >
        <ModalBody>
          <AboutModalContent/>
        </ModalBody>
      </Modal>
    );
  }
}
