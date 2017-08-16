import {observable} from 'mobx';
import {UiService} from './UiService';

export default class UiStore implements UiService {
  @observable loginModalOpen =  false;
  @observable questionInputOpen = false;
}
