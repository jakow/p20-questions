import { observable, computed, action } from 'mobx';
import apiStore from './ApiStore';
import { QuestionDocument } from './Document';

export default class Question implements QuestionDocument {
  private static shape = {
    _id: String,
    text: String,
    askedBy: String,
    dateCreated: Date,
    dateAccepted: Date,
    accepted: Boolean,
    archived: Boolean,
    forEvent: String,
    toPerson: String,
  };
  _id: string;
  text: string = '';
  askedBy?: string = '';
  toPerson?: string = '';
  forEvent?: string = '';
  dateCreated: Date;
  // these do
  @observable dateAccepted?: Date;
  @observable private _archived = false;
  @observable private _accepted = false;

  private sync: boolean = true;

  constructor(json: QuestionDocument) {
    this.updateFromJSON(json);
  }

  @computed get archived() {
    return this._archived;
  }

  set archived(state: boolean) {
    console.log(`Question ${this._id} archived: ${state}`);
    if (this.sync) {
      this.patch('archived', state);
    }
    this._accepted = state;
  }

  @computed get accepted() {
    console.log('Get: accepted');
    return this._accepted;
  }

  set accepted(state: boolean) {
    console.log(`Question ${this._id} accepted: ${state}`);
    if (this.sync) {
      this.patch('accepted', state);
    }
    this._accepted = state;
  }

  toJSON(): QuestionDocument {
    return {
      _id: this._id,
      text: this.text,
      askedBy: this.askedBy,
      accepted: this.accepted,
      archived: this.archived,
      dateAccepted: this.dateAccepted.toUTCString(),
      dateCreated: this.dateCreated.toUTCString(),
    };

  }
  @action
  public updateFromJSON(data: any) { //tslint:disable-line
    this.sync = false;
    for (const key of Object.keys(data)) {
      if (Question.shape.hasOwnProperty(key)) {
        const type = Question.shape[key];
        // parse date from json
        if (type === Date) {
          this[key] = new Date(data[key]);
        } else {
          this[key] = data[key];
        }
      }
    }
    this.sync = true;
  }

  @action
  private async patch<T extends keyof Question>(field: T, nextValue: Question[T]) {
    const prevValue = this[field];
    console.log(`patch ${field}: ${prevValue} => ${nextValue}`);
    const p = [
      { op: 'replace', path: '/' + field, value: nextValue }
    ];
    try {
      await apiStore.update(`questions/${this._id}`, { body: p });
      // this.updateFromJSON(response); // no need for an update, sockets will do it
    } catch (e) {
      // avoid sync-ing the value with the server again
      this.sync = false;
      this[field] = prevValue;
      this.sync = true;
    }
  }
}