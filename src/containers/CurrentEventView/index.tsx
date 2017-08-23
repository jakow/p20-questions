import * as React from 'react';
import { observer, inject } from 'mobx-react';
import EventStore from '../../services/EventStore';
import { Event as EventDocument } from '../../models/Event';
import { Speaker as SpeakerDocument } from '../../models/Speaker';
import EventView from '../../components/EventView';

interface CurrentEventViewProps {
  eventStore?: EventStore;
}

const mockEvent: EventDocument = {
  _id: '420',
  description: 'Sample description lorem ipsum dolor sit amet',
  name: 'Mock event',
  type: 'Speech',
  time: {
    start: new Date(),
    end: new Date(),
  },
  speakers: [],
  venue: {
    _id: '421',
    name: 'Imperial College London',
    location: null,
  }
};

const mockSpeakers: SpeakerDocument[] = [
  {_id: '12314123', name: 'Jakub Kowalczyk', company: 'giffgaff', position: 'Software engineer'}
];

@inject('eventStore')
@observer
export default class CurrentEventView extends React.Component<CurrentEventViewProps, null> {
  render() {
    const store = this.props.eventStore;
    if (store.selectedEvent == null) {
      return null;
    } 
    return <EventView event={mockEvent} speakers={mockSpeakers}/>;
  }
}