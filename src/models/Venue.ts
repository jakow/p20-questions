import {Document} from './Document';

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