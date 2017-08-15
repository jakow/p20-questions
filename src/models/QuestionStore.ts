import {observable, computed, action} from 'mobx';
import {QuestionData, QuestionDocument} from './Document';
import Question from './Question';
import apiStore from './ApiStore';
import eventStore, {Event, Speaker} from './EventStore';
import {Option} from '../components/Select';
import * as validate from 'validate.js';
type Id = string;
type QuestionMap = Map<Id, Question>;

enum QuestionSort {
  BY_DATE_ACCEPTED,
  BY_DATE_ADDED,
  UNSORTED
}

export class QuestionStore {
  @observable pendingRequests = 0; // number of 'threads' that wait for resources, used for a global loader
  @observable questions: QuestionMap = new Map();

  @observable newQuestion: Partial<QuestionData> = {
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

  constructor() {
    this.init();
  }

  async init() {
    await this.loadQuestions();
    apiStore.addSocketConnectionCallback(this.initIO);
    apiStore.addLoginCallback(() => this.loadQuestions());
  }

  initIO = async (io: SocketIOClient.Socket) => {
    io.on('question', (q: QuestionDocument) => this.updateQuestions([q]));
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
    try {
      this.pendingRequests++;
      const questions = await apiStore.fetch('questions');
      this.updateQuestions(questions);
    } catch (e) {
      // TODO: handle fetch error
    } finally {
      this.pendingRequests--;
    }
  }

  @action 
  updateQuestions(questions: QuestionDocument[]) {
    for (const q of questions) {
      if (this.questions.has(q._id)) {
        this.questions.get(q._id).updateFromJSON(q);
      } else {
        this.questions.set(q._id, new Question(q));
      }
    }
  }

  @action 
  removeQuestion(question: QuestionDocument | Id) {
    if (typeof question === 'string') {
      this.questions.delete(question);
    } else {
      this.questions.delete(question._id);
    }
  }

  validateQuestion(q: Partial<QuestionData>) {
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
      this.pendingRequests++;
      await apiStore.create('questions', {
        body: this.newQuestion,
      });
      this.resetQuestion();
      this.selectedSpeaker = null;
      return null;
    } catch (e) {
      return e.message;
    } finally {
      this.pendingRequests--;
    }
  }

  @action resetQuestion() {
    this.newQuestion.text = '';
    this.newQuestion.askedBy = '';
    this.newQuestion.forEvent = '';
    this.newQuestion.toPerson = '';
  }

  @computed get eventOptions() {
    const options: Option[] = [{ name: 'Anything', value: '' }];
    for (const e of eventStore.eventList) {
      options.push({
        name: e.name,
        value: e._id,
      });
    }
    return options;
  }

  @computed get speakerOptions() {
    let speakers;
    if (this.selectedEvent) {
      speakers = eventStore.speakersForEvent(this.selectedEvent);
    } else {
      speakers = eventStore.speakerList;
    }
    const options: Option[] = [{ name: 'All speakers', value: '' }];
    for (const s of speakers) {
      options.push({ name: s.name, value: s._id });
    }
    return options;
  }

  @action selectEvent(event: string | Event | null) {
    if (typeof event === 'string') {
      this.selectedEvent = eventStore.events.get(event) || null;
    } else {
      this.selectedEvent = event;
    }
    return this.selectedEvent;
  }

  @action selectSpeaker(speaker: string | Speaker | null) {
    if (typeof speaker === 'string') {
      this.selectedSpeaker = eventStore.speakers.get(speaker) || null;
    } else {
      this.selectedSpeaker = speaker || null;
    }
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

/**
 * Experimental class to create a domain object for a question that keeps in sync
 * with the backend
 */

const store = new QuestionStore();
(global as any).questionStore = store; // tslint:disable-line
export default store;