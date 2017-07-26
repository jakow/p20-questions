type HasId = {_id: string};
export type Document<T> = T & HasId;

interface Person {
  name: string;
  position: string;
  company: string;
  photo: string;
  description: string;
}

export type PersonDocument = Document<Person>;

type Id = string;

interface Event {
  name: string;
  description: string;
  image: string;
  time: {
    start: string;
    end: string;
  };
  speakers: PersonDocument[];
  date: Date;
  venue: string;
}

export type EventDocument = Document<Event>;

export interface Question {
  text: string;
  dateAdded: Date | string;
  accepted: boolean;
  archived: boolean;
  askedBy?: string;
  toPerson?: PersonDocument | Id;
  forEvent?: EventDocument | Id;
  dateAccepted?: Date | string;
}

export type QuestionDocument = Document<Question>;