import {observable} from 'mobx';

export default class UiStore {
  @observable loginModalOpen =  false;
  @observable aboutModalOpen = false;
  @observable questionInputOpen = false;
  @observable fetchingQuestions = false;
  @observable questionFetchError = false;
  @observable submittingQuestion = true;
  @observable eventCollapseOpen = true;

  @observable notifications: Notification[] = [];
  
  @observable windowWidth = 0;
  @observable windowHeight = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.measureWindow();
      window.addEventListener('resize', this.measureWindow);
    }
  }

  measureWindow = () => {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
}

export enum NotificationIcon {
  SUCCESS,
  ERROR,
  WARNING,
}
