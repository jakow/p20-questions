import {Document} from './Document';
import {Speaker} from './Speaker';
import {Event} from './Event';

export interface QuestionData {
  text: string;
  dateCreated: Date;
  accepted: boolean;
  archived: boolean;
  askedBy?: string;
  toPerson?: Speaker | string;
  forEvent?: Event | string;
  dateAccepted?: Date;
}

export type Question = Document<QuestionData>;

const prototype: Question = {
  _id: null,
  accepted: false,
  archived: false,
  text: '',
  toPerson: '',
  forEvent: '',
  askedBy: '',
  dateCreated: new Date(0),
  dateAccepted: null,
};

// const schema = {
//   _id: String,
//   text: String,
//   askedBy: String,
//   dateCreated: Date,
//   dateAccepted: Date,
//   accepted: Boolean,
//   archived: Boolean,
//   forEvent: String,
//   toPerson: String,
// };

/**
 * 
 * @param json Input json data
 * @returns a valid question document from json data
 */
export function question(json: any): Question { //tslint:disable-line
  const q: Question = {...prototype};
  for (const key of Object.keys(q)) {
    if (!json.hasOwnProperty(key)) { continue; }
    // parse date if prototype has date
    if (q[key] instanceof Date) {
      q[key] = new Date(json[key]);
    } else { 
      q[key] = json[key];
    }
  }
  return q;
}
