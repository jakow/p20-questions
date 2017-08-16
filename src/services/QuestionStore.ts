import {observable, computed, action} from 'mobx';
import {ApiService} from './ApiService';
import {question, Question} from '../models/Question';
import {Speaker} from '../models/Speaker';
import {Event} from '../models/Event';
import * as validate from 'validate.js';
type Id = string;
type QuestionMap = Map<Id, Question>;

enum QuestionSort {
  BY_DATE_ACCEPTED,
  BY_DATE_ADDED,
  UNSORTED
}

export default class QuestionStore {
  @observable fetching = false; // are questions being fetched from server?
  @observable questions: QuestionMap = new Map();

  @observable newQuestion: Partial<Question> = {
    text: '',
    askedBy: '',
    toPerson: '',
    forEvent: '',
  };
  @observable sortMethod: QuestionSort = QuestionSort.BY_DATE_ACCEPTED;

  // for rendering a list of options when asking a question
  @observable selectedEvent: Event = null;
  @observable selectedSpeaker: Speaker = null;

  @observable submittingQuestion: boolean = false;

  constructor(private api: ApiService) {
    this.init();
  }

  init() {
    this.loadQuestions();
    this.api.onSocketConnection(this.initIO);
    this.api.onLogin(() => this.loadQuestions());
  }

  initIO = async (io: SocketIOClient.Socket) => {
    io.on('question', (q: Question) => this.updateQuestions([q]));
    if (io.nsp === '/client') {
      io.on('remove question', (id: string) => this.removeQuestion(id));
    }
  }

  @computed 
  get questionList() {
    let questions = Array.from(this.questions.values());
    if (this.selectedEvent) {
      questions = questions.filter((q) => q.forEvent === this.selectedEvent._id);
    }
    switch (this.sortMethod) {
      case QuestionSort.BY_DATE_ACCEPTED:
        return questions.sort(byDateAccepted);
      case QuestionSort.BY_DATE_ADDED:
        return questions.sort(byDateCreated);
      default:
        return questions;
    }
  }

  @action 
  async loadQuestions() {
    this.fetching = true;
    try {
      const questions = await this.api.fetch<any[]>('questions'); //tslint:disable-line
      this.updateQuestions(questions);
    } catch (e) {
      // TODO: handle fetch error
    } finally {
      this.fetching = false;
    }
  }

  @action 
  updateQuestions(questions: Question[]) {
    for (const q of questions) {
      this.questions.set(q._id, question(q));
    }
  }

  @action 
  removeQuestion(question: Question | Id) {
    if (typeof question === 'string') {
      this.questions.delete(question);
    } else {
      this.questions.delete(question._id);
    }
  }

  validateQuestion(q: Partial<Question>) {
    const constraints = {
      text: {
        presence: {message: '^A question is required'},
        length: {
          minimum: 2,
          maximum: 500,
          tokenizer: (s: string) => s.trim().split(/\s+/g),
          tooShort: '^Your question must be at least %{count} words long',
          tooLong: '^Your question is too long',
        },
      }
    };
    return validate(this.newQuestion, constraints);
  }

  @action async submitQuestion() {
    this.newQuestion.forEvent = this.selectedEvent && this.selectedEvent._id;
    this.newQuestion.toPerson = this.selectedSpeaker && this.selectedSpeaker._id;
    const error = this.validateQuestion(this.newQuestion);
    if (error) {
      return error;
    }
    try {
      this.fetching = true;
      await this.api.create('questions', {
        body: this.newQuestion,
      });
      this.resetQuestion();
      this.selectedSpeaker = null;
      return null;
    } catch (e) {
      return e.message;
    } finally {
      this.fetching = false;
    }
  }

  @action resetQuestion() {
    this.newQuestion.text = '';
    this.newQuestion.askedBy = '';
    this.newQuestion.forEvent = '';
    this.newQuestion.toPerson = '';
  }
}

// Question sorts 
function byDateAccepted(q1: Question, q2: Question) {
  if (typeof q2.dateAccepted === 'undefined') {
    return -1;
  } else if (typeof q1.dateAccepted === 'undefined') {
    return 1;
  } else {
    return +new Date(q1.dateAccepted) - +new Date(q2.dateAccepted);
  }
}

function byDateCreated(q1: Question, q2: Question) {
  return +q1.dateCreated - +q2.dateCreated;
}