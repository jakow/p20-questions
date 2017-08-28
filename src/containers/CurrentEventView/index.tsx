import * as React from 'react';
import { observer, inject } from 'mobx-react';
import EventStore from '../../services/EventStore';
// import { Event as EventDocument } from '../../models/Event';
// import { Speaker as SpeakerDocument } from '../../models/Speaker';
import EventView from '../../components/EventView';

interface CurrentEventViewProps {
  eventStore?: EventStore;
}

@inject('eventStore')
@observer
export default class CurrentEventView extends React.Component<CurrentEventViewProps, null> {
  render() {
    const store = this.props.eventStore;
    if (store.selectedEvent == null) {
      return null;
    }
    const speakerList = store.selectedEvent.speakers.map(id => store.speakers.get(id));
    return <EventView event={store.selectedEvent} speakers={speakerList}/>;
  }
}
