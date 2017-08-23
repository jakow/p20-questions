import {observable, computed, action} from 'mobx';
import {question, Question, QuestionSort, QuestionFilter} from '../models/Question';
import ApiStore from './ApiStore';
import UiStore from './UiStore';
import EventStore from './EventStore';
import * as validate from 'validate.js';
type Id = string;
type QuestionMap = Map<Id, Question>;

export default class QuestionStore {
  @observable questions: QuestionMap = new Map();
  @observable sort: QuestionSort = QuestionSort.BY_DATE_ADDED;
  @observable filter: QuestionFilter = QuestionFilter.ACCEPTED;

  // for rendering a list of options when asking a question

  constructor(private api: ApiStore, private eventStore: EventStore, public uiStore: UiStore) {
    this.loadQuestions();
    this.api.onSocketConnection(this.initIO);
    this.api.onLogin(() => this.loadQuestions());
  }

  @computed 
  get questionList() {
    let questions = Array.from(this.questions.values());
    let selectedEvent = this.eventStore.selectedEvent;
    if (selectedEvent) {
      questions = questions.filter((q) => q.forEvent === selectedEvent._id);
    }
    switch (this.filter) {
      case QuestionFilter.ACCEPTED:
        questions = questions.filter(q => q.accepted && !q.archived);
        break;
      case QuestionFilter.UNARCHIVED:
        questions = questions.filter(q => !q.archived);
        break;
      default:
        break;
    }
    switch (this.sort) {
      case QuestionSort.BY_DATE_ACCEPTED:
        return questions.sort(byDateAccepted);
      case QuestionSort.BY_DATE_ADDED:
        return questions.sort(byDateCreated);
      default:
        return questions;
    }
  }

  async loadQuestions() {
    this.uiStore.fetchingQuestions = true;
    try {
      const questions = await this.api.read<Question[]>('questions'); //tslint:disable-line
      this.updateQuestions(questions);
      this.uiStore.questionFetchError = false;
    } catch (e) {
      this.uiStore.questionFetchError = true;
    }
    this.uiStore.fetchingQuestions = false;
  }

  async sendQuestionToServer(q: Question, patch?: Partial<Question>) {
    this.uiStore.fetchingQuestions = true;
    let body;
    if (patch) {
      body = patch;
    } else {
      body = q;
    }
    await this.api.update(`questions/${q._id}`, {body});
    this.uiStore.fetchingQuestions = false;
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

  /**
   * Is this question valid?
   * @param q 
   */
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
    return validate(q, constraints);
  }

  submitQuestion(q: Partial<Question>) {
    const errors = this.validateQuestion(q);
    if (errors) {
      return errors;
    }
    this.api.create('questions', {
      body: q
    });

    return null;
  }

  private initIO = (io: SocketIOClient.Socket) => {
    io.on('question', (q: Question) => this.updateQuestions([q]));
    if (io.nsp === '/client') {
      io.on('remove question', (id: string) => this.removeQuestion(id));
    }
  }
}

// Question sort methods

/**
 * Sort questions by acceptance date
 * @param q1 first
 * @param q2 second
 * @return total order of questions by date
 */
function byDateAccepted(q1: Question, q2: Question) {
  if (typeof q2.dateAccepted === 'undefined') {
    return -1;
  } else if (typeof q1.dateAccepted === 'undefined') {
    return 1;
  } else {
    return +new Date(q1.dateAccepted) - +new Date(q2.dateAccepted);
  }
}

/**
 * Sort questions by creation date
 * @param q1 
 * @param q2 
 * @return total order of q1 and q2 by creation date
 */
function byDateCreated(q1: Question, q2: Question) {
  return +q1.dateCreated - +q2.dateCreated;
}

// TODO: Function decorator that awaits an async function and
// shows a loading indicator in the meantime
