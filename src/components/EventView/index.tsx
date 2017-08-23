import * as React from 'react';
import Speaker from '../Speaker';
import { Event as EventDocument} from '../../models/Event';
import { Speaker as SpeakerDocument } from '../../models/Speaker';
const style = require('./EventView.pcss');

interface EventViewProps {
  event: EventDocument;
  speakers?: SpeakerDocument[];
}

export default function EventView({event, speakers}: EventViewProps) {
  return (
  <div className={style.event}>
    <header className={style.header}>
    <p>{format(event.time.start, event.time.end)} | {event.venue.name}</p>
    <h2>{event.name}</h2>
    </header>
    <div>
      {speakers ? speakers.map(s => <Speaker speaker={s}/>) : null}
    </div>
  </div>);
}

function format(start: Date, end: Date) {
  // TODO: use momentjs
  return '18th November, 9:00–10:00';

}