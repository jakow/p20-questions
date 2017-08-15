import {observable} from 'mobx';

export class UiStore {
  @observable loginModalOpen =  false;
  @observable questionInputOpen = false;
}

const store = new UiStore();

export default store;