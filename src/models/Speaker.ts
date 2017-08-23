import {Document} from './Document';
import {ImageObject} from './ImageObject';
interface SpeakerData {
  name: string;
  position: string;
  company?: string;
  photo?: ImageObject;
  description?: string;
}

export type Speaker = Document<SpeakerData>;
