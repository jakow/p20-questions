import {Document} from './Document';
import {ImageObject} from './ImageObject';
import {VenueDocument} from './Venue';

interface EventData {
  name: string;
  type?: string;
  description?: string;
  time: {
    start: Date;
    end: Date;
  };
  image?: ImageObject;
  venue: VenueDocument;
  speakers: string[];
}

export type Event = Document<EventData>;

export function event(json: any): Event { // tslint:disable-line
  // TODO: this!
  return null;
}
