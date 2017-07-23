import {observable, computed, action} from 'mobx';
import * as SocketIO from 'socket.io-client';
import {QuestionDocument} from './Document';

type Id = string;
type QuestionMap = Map<Id, QuestionDocument>;

const SERVER_URI = process.env.NODE_ENV === 'production' ? 'https://poland20.com' : 'http://localhost:4000';

/* Connect to the APIs */
// REST API string generation
const api = (route: string) => `${SERVER_URI}/api/${route}`;
// Create a socketio connection to the real-time question API

export class QuestionStore {
  @observable isLoading = 0; // number of 'threads' that wait for resources, used for a global loader
  @observable questions: QuestionMap = new Map();
  io = SocketIO(SERVER_URI);
  constructor() {
    // this.io 
    this.init();
  }

  async init() {
    await this.fetchQuestions();
    this.initIO();
  }

  initIO() {
    const io = this.io;
    io.on('question', (question: QuestionDocument) => {
      this.updateQuestions([question]);
    });
  }

  @computed get questionsByDateAdded() {
    return Array.from(this.questions.values()).sort(byDateAdded);
  }

  @action async fetchQuestions() {
    this.isLoading++;
    const questions = await fetch(api('questions'), {mode: 'cors'}).then((r) => r.json());
    this.updateQuestions(questions);
    this.isLoading--;
  }

  @action updateQuestions(questions: QuestionDocument[]) {
    for (const q of questions) {
      console.log(q);
      this.questions.set(q._id, q);
    }
  }

  @action removeQuestion(question: QuestionDocument | Id) {
    if (typeof question === 'string') {
      this.questions.delete(question);
    } else {
      this.questions.delete(question._id);
    }
  }
}

function byDateAdded(q1: QuestionDocument, q2: QuestionDocument) {
  if (typeof q2.dateAccepted === 'undefined') {
    return -1;
  } else if (typeof q1.dateAccepted === 'undefined') {
    return 1;
  } else {
    return +new Date(q1.dateAccepted) - +new Date(q2.dateAccepted);
  }
}