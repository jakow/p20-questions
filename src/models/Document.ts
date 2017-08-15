type HasId = {_id: string};
export type Document<T> = T & HasId;

export interface ImageObject {
  url: string;
  secure_url: string;
}

interface SpeakerData {
  name: string;
  position: string;
  company: string;
  photo: ImageObject;
  description: string;
}

export type SpeakerDocument = Document<SpeakerData>;

type Id = string;

interface VenueData {
  name: string;
  location: {
    geo: number[];
    number: string;
    name: string;
    street1: string;
    street2: string;
    suburb: string;
    
    country: string;

  };
}

export type VenueDocument = Document<VenueData>;

interface EventData {
  name: string;
  type: string;
  description: string;
  image: ImageObject;
  time: {
    start: string;
    end: string;
  };
  speakers: string[];
  agendaDay: string;
  venue: VenueDocument;
}

export type EventDocument = Document<EventData>;

export interface QuestionData {
  text: string;
  dateCreated: Date | string;
  accepted: boolean;
  archived: boolean;
  askedBy?: string;
  toPerson?: SpeakerDocument | Id;
  forEvent?: EventDocument | Id;
  dateAccepted?: Date | string;
}

export type QuestionDocument = Document<QuestionData>;

interface User {
  email: string;
  name: string;
  imgUrl: string;
}

export type UserDocument = Document<User>;