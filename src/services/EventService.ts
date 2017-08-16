import {Event} from '../models/Event';
import {Speaker} from '../models/Speaker';
import { Option } from '../components/Select';

export interface EventService {
  selectedEvent: Event;
  selectedSpeaker: Speaker;
  eventOptions: Option[];
  speakerOptions: Option[];
  selectEvent(eventId: string): void;
  selectSpeaker(speakerId: string): void;
  speakersForEvent(event: string | Event): Speaker[];
  eventsForSpeaker(speaker: string | Speaker): Event[];
}