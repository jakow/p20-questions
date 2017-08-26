import {action, observable, computed} from 'mobx';
import ApiStore from './ApiStore';
import {Speaker} from '../models/Speaker';
import {Event} from '../models/Event';

export default class EventStore {
  @observable events = new Map<string, Event>();
  @observable speakers = new Map<string, Speaker>();
  @observable selectedEvent: Event;
  @observable selectedSpeaker: Speaker;

  constructor(private api: ApiStore) {
    this.fetchAll();
  }

  @computed get eventOptions() {
    const options = [{ name: 'Anything', value: '' }];
    for (const e of this.eventList) {
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
      speakers = this.speakersForEvent(this.selectedEvent);
    } else {
      speakers = this.speakerList;
    }
    const options = [{ name: 'All speakers', value: '' }];
    for (const s of speakers) {
      options.push({ name: s.name, value: s._id });
    }
    return options;
  }

  @action selectEvent(event: string | Event | null) {
    if (typeof event === 'string') {
      this.selectedEvent = this.events.get(event) || null;
    } else {
      this.selectedEvent = event;
    }
    return this.selectedEvent;
  }

  @action selectSpeaker(speaker: string | Speaker | null) {
    if (typeof speaker === 'string') {
      this.selectedSpeaker = this.speakers.get(speaker) || null;
    } else {
      this.selectedSpeaker = speaker || null;
    }
  }

  @computed get eventList() {
    return Array.from(this.events.values()).sort(byStartTime);
  }

  @computed get speakerList() {
    return Array.from(this.speakers.values());
  }

  @action
  async fetchEvents() {
      const result = await this.api.read<Event[]>('events'); // tslint:disable-line
      console.log('events: ', result);
      for (const e of result) {
        this.events.set(e._id, e);
      }
  }

  @action
  async fetchSpeakers() {
    const result = await this.api.read<Speaker[]>('speakers'); // tslint:disable-line
    for (const s of result) {
      this.speakers.set(s._id, s);
    }
    return this.speakers;
  }

  speakersForEvent(event: string | Event) {
    const id = typeof event === 'string' ? event : event._id;
    return this.events.get(id).speakers.map((s) => this.speakers.get(s));
  }

  eventsForSpeaker(speaker: string | Speaker) {
    const id = typeof speaker === 'string' ? speaker : speaker._id;
    return Array.from(this.events.values()).filter((e) => e.speakers.includes(id));
  }

  private fetchAll() {
    // TODO consider graphql to minimize requests
    return Promise.all([
      this.fetchSpeakers(),
      this.fetchEvents(),
    ]);

  }
}

function byStartTime(e1: Event, e2: Event) {
  return +e1.time.start - +e2.time.start;
}
