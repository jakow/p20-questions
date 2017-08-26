import * as React from 'react';
import Speaker from '../Speaker';
import * as moment from 'moment';
import { Event as EventDocument} from '../../models/Event';
import { Speaker as SpeakerDocument } from '../../models/Speaker';
const style = require('./EventView.pcss');

interface EventViewProps {
  event: EventDocument;
  speakers?: SpeakerDocument[];
}

export default function EventView({event, speakers}: EventViewProps) {
  let formatted = '';
  if (event.time) {
    formatted = format(event.time.start, event.time.end);
  }
  let venue  = '';
  if (event.venue) {
    venue = ` | ${event.venue.name}`;
  }
  if (formatted) {
    formatted += ' | ' + venue;
  } else {
    formatted = venue;
  }

  return (
  <div className={style.event}>
    <header className={style.header}>
    <p>{formatted}</p>
    <h2>{event.name}</h2>
    </header>
    <ul className={style.speakerList}>
      {speakers ? speakers.map(s => <li key ={s._id}><Speaker speaker={s}/></li>) : null}
    </ul>
  </div>);
}

function format(start: Date, end: Date) {
  let startMoment;
  let endMoment;
  if (start) {
    startMoment = moment(start);
  }
  if (end) {
    endMoment = moment(end);
  }
  if (!startMoment && endMoment) {
    return `${endMoment.format('Do MMMM')}, until ${endMoment.format('HH:mm')}`;
  } else if (endMoment && !endMoment) {
    return `${startMoment.format('Do MMMM')}, from ${startMoment.format('HH:mm')}`;
  } else {
    return `${startMoment.format('Do MMMM')}, ${startMoment.format('hh:mm')}–${endMoment.format('hh:mm')}`;
  }

}
