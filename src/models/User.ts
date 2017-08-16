import {Document} from './Document';
import {ImageObject} from './ImageObject';

interface UserData {
  email: string;
  name: string;
  photo: ImageObject;
}

export type User = Document<UserData>;
