import {observable} from 'mobx';

export default class UiStore {
  @observable loginModalOpen =  false;
  @observable questionInputOpen = false;
  @observable fetchingQuestions = false;
  @observable questionFetchError = false;
  @observable submittingQuestion = true;
  @observable notifications: Notification[] = [];
}

export enum NotificationIcon {
  SUCCESS,
  ERROR,
  WARNING
}