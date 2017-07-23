type HasId = {_id: string, __v: string};
export type Document<T> = T & HasId;

interface Speaker {
  name: string;
  position: string;
  company: string;
  photo: string;
  description: string;
}

export type SpeakerDocument = Document<Speaker>;

interface Event {
  name: string;
  description: string;
  image: string;
  time: {
    start: string;
    end: string;
  };
  speakers: SpeakerDocument[];
  date: Date;
  venue: string;
}

export type EventDocument = Document<Event>;

interface Question {
  text: string;
  askedBy: string;
  toPerson: SpeakerDocument;
  forEvent: EventDocument;
  dateAccepted?: string; // TODO: auto date conversion?
  accepted: boolean;
  
}

export type QuestionDocument = Document<Question>;