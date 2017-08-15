import {action, observable, computed} from 'mobx';
import apiStore from './ApiStore';
import {EventDocument, ImageObject, VenueDocument, SpeakerDocument} from './Document';

export class EventStore {
  @observable events = new Map<string, Event>();
  @observable speakers = new Map<string, Speaker>();
  @observable selectedEvent: Event;

  constructor() {
    this.fetchAll();
  }

  async fetchAll() {
    // need to get speakers first to populate events
    await this.fetchSpeakers();
    this.fetchEvents();

  }

  @computed get eventList() {
    return Array.from(this.events.values()).sort(byStartTime);
  }

  @computed get speakerList() {
    return Array.from(this.speakers.values());
  }

  @action
  async fetchEvents() {
      const result = await apiStore.read('events') as EventDocument[];
      for (const e of result) {
        this.events.set(e._id, new Event(e));
      }
  }

  @action
  async fetchSpeakers() {
    const result: SpeakerDocument[] = await apiStore.read('speakers');
    for (const s of result) {
      this.speakers.set(s._id, new Speaker(s));
    }
  }

  @action
  selectEvent(id: string) {
    const e = this.events.get(id);
    if (!e) {
      throw new Error('No such object');
    } else {
      this.selectedEvent = e;
    }
  }

  speakersForEvent(event: string | Event) {
    const id = typeof event === 'string' ? event : event._id;
    return this.events.get(id).speakers;
  }

  eventsForSpeaker(speaker: string | Speaker) {
    const id = typeof speaker === 'string' ? speaker : speaker._id;
    return this.speakers.get(id).events;
  }
}
const store = new EventStore();
(window as any).eventStore = store; // tslint:disable-line
export default store;

export class Event {
  readonly _id: string;
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly image: ImageObject;
  readonly start: Date;
  readonly end: Date;
  readonly venue: VenueDocument;
  readonly speakerIds: string[];
  constructor(json: EventDocument) {
    if (json) {
      this._id = json._id;
      this.name = json.name;
      this.type = json.type;
      this.description = json.description;
      this.image = json.image;
      this.start = new Date(json.time.start);
      this.end = new Date(json.time.end);
      this.venue = json.venue;
      this.speakerIds = json.speakers;
    } else {
      throw new Error('Contructor parameter missing');
    }
  }

  get speakers() {
    return this.speakerIds.map((id) => store.speakers.get(id));
  }
}

export class Speaker implements SpeakerDocument {
  readonly _id: string;
  name: string;
  position: string;
  company: string;
  photo: ImageObject;
  description: string;
  constructor(json: SpeakerDocument) {
    this._id = json._id;
    this.name = json.name;
    this.position = json.position;
    this.company = json.company;
    this.photo = json.photo;
    this.description = json.description;
  }

  get events() {
    return store.eventList.filter((e) => e.speakerIds.includes(this._id));
  }
}

function byStartTime(e1: Event, e2: Event) {
  return +e1.start - +e2.start;
}