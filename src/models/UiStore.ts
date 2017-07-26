import {observable} from 'mobx';

class UiStore {
  @observable loginModalOpen =  false;
}

const store = new UiStore();

export default store;