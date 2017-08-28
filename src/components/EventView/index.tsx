import * as React from 'react';
import Speaker from '../Speaker';
import format from '../../helpers/formatEventTime';
import { Event as EventDocument} from '../../models/Event';
import { Speaker as SpeakerDocument } from '../../models/Speaker';
const style = require('./EventView.pcss');

interface EventViewProps {
  event: EventDocument;
  speakers?: SpeakerDocument[];
}

export default function EventView({event, speakers}: EventViewProps) {
  let time = '';
  if (event.time) {
    time = format(event.time.start, event.time.end);
  }
  let venue = '';
  if (event.venue) {
    if (event.venue.name) {
      venue = event.venue.name;
    } else if (event.venue.location && event.venue.location.name) {
      venue = event.venue.location.name;
    }
  }

  return (
    <div className={style.event}>
      <header className={style.header}>
        <p className={style.meta}>
        {time ? <time>{time}</time> : null}
        {time && venue ? ' | ' : null}
        {venue ? <span>{venue}</span> : null} 
        </p>
        <h2 className={style.name}>{event.name}</h2>
      </header>
      <ul className={style.speakerList}>
        {speakers ? speakers.map(s => <li key ={s._id}><Speaker speaker={s}/></li>) : null}
      </ul>
      <div className={style.description}>
        <div dangerouslySetInnerHTML={{__html:event.description}}/>
      </div>
    </div>
  );
}


