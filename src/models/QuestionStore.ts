import {observable, computed, action} from 'mobx';
import {Question, QuestionDocument} from './Document';
import apiStore from './ApiStore';

type Id = string;
type QuestionMap = Map<Id, Q>;
const MIN_QUESTION_LENGTH = 3;

export class QuestionStore {
  @observable isLoading = 0; // number of 'threads' that wait for resources, used for a global loader
  @observable questions: QuestionMap = new Map();

  @observable newQuestion = {askedBy: '', text: ''};
  @observable submitting: boolean = false;

  constructor() {
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.initIO();
  }

  initIO() {
    const io = apiStore.socketIo;
    io.on('question', (question: QuestionDocument) => {
      this.updateQuestions([question]);
    });

    io.on('remove question', (questionId: Id) => {
      this.removeQuestion(questionId);
    });
  }

  @computed get questionsByDateAdded() {
    return Array.from(this.questions.values()).sort(byDateAdded);
  }

  @action async loadQuestions() {
    this.isLoading++;
    const questions = await apiStore.httpApi('questions').then((r) => r.json());
    this.updateQuestions(questions);
    this.isLoading--;
  }

  @action updateQuestions(questions: QuestionDocument[]) {
    for (const q of questions) {
      this.questions.set(q._id, new Q(q));
    }
  }

  @action removeQuestion(question: QuestionDocument | Id) {
    if (typeof question === 'string') {
      this.questions.delete(question);
    } else {
      this.questions.delete(question._id);
    }
  }

  isQuestionValid(q: Partial<Question>) {
    if (q.text.trim().split(/\s+/g).length < MIN_QUESTION_LENGTH) {
      return 'Your question is too short';
    } else {
      return null;
    }
  }

  @action async submitQuestion() {
    const error = this.isQuestionValid(this.newQuestion);
    if (error) {
      return error;
    }
    try {
      this.submitting = true;
      const response = await apiStore.httpApi('questions', {
        body: JSON.stringify(this.newQuestion),
      });
      const result = await response.json();
      if (response.status !== 200) {
        return result.message as string;
      } else {
        return null;
      }
    } catch (e) {
      return e;
    } finally {
      this.submitting = false;
    }
  }
}

function byDateAdded(q1: Q, q2: Q) {
  if (typeof q2.dateAccepted === 'undefined') {
    return -1;
  } else if (typeof q1.dateAccepted === 'undefined') {
    return 1;
  } else {
    return +new Date(q1.dateAccepted) - +new Date(q2.dateAccepted);
  }
}

/**
 * Experimental class to create a domain object for a question that keeps in sync
 * with the backend
 */
class Q implements QuestionDocument {
  // these don't change
  _id: string;
  text: string = '';
  askedBy?: string = '';
  toPerson?: string = '';
  forEvent?: string = '';
  dateAdded: Date;
  // these do
  @observable dateAccepted?: Date;
  @observable private archivedState = false;
  @observable private acceptedState = false;

  private autoUpdate: boolean = true;
  constructor(json?: QuestionDocument) {
    if (json) {
      this._id = json._id;
      this.text = json.text;
      this.askedBy = json.askedBy;
      this.toPerson = json.toPerson as string;
      this.forEvent = json.forEvent as string; // TODO: when an eventStore is created, find the said event
      this.dateAdded = new Date(json.dateAdded as string);
      this.dateAccepted = json.dateAccepted && new Date(json.dateAccepted as string);
      this.archivedState = json.archived;
      this.acceptedState = json.accepted;
    }
  }

  @computed get archived() {
    return this.archivedState;
  }

  set archived(state: boolean) {
    this.patch('archived', state);
    this.acceptedState = state;
  }

  @computed get accepted() {
    return this.acceptedState;
  }

  set accepted(state: boolean) {
    // give a json 
    if (this.autoUpdate) {
      this.patch('accepted', state);
    }
    this.acceptedState = state;
  }

  async sendToServer() {
    apiStore.httpApi('question', {
      method: 'post',
      body: this.toJSON(),
    })
  }

  toJSON(): QuestionDocument {
    return {
      _id: this._id,
      text: this.text,
      askedBy: this.askedBy,
      accepted: this.accepted,
      archived: this.archived,
      dateAccepted: this.dateAccepted.toUTCString(),
      dateAdded: this.dateAdded.toUTCString(),
    }
  }
  @action
  private updateFromJson(data: any) {
    this.autoUpdate = false;
    // assumes that the json document is a valid QuestionDocument
    for (const key of Object.keys(data)) {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
    this.autoUpdate = true;

  }


  private async patch<T extends keyof Q>(field: T, nextValue: Q[T]) {
    console.debug(`Patching ${field}: ${this[field]} => ${nextValue}`);
    const prevValue = this[field];
    const p = [
      {op: 'replace', path: '/' + field, nextValue}
    ];
    try {
      const response = await apiStore.httpApi(`questions/${this._id}`, {method: 'patch', body: p})
      const result = await response.json();
      this.updateFromJson(result);
    } catch (e) {
      this.updateFromJson({field: prevValue});
      // 
    }
  }
}

(global as any).Q = Q;

const store = new QuestionStore();
export default store;