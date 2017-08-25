import 'url-polyfill';

type Gravity = 'face' | 'faces' |  'center' | 'face:center' | 'faces:center' | 
  'north' | 'north_east' | 'east' | 'south_east' | 'south' | 'south_west' | 'west' | 'north_west';
type Crop = 'fit' | 'limit' | 'mfit'| 'lfill'| 'pad'| 'lpad'| 'mpad'| 'crop'| 'thumb';

interface TransformationOptions {
  crop: Crop;
  width: number;
  height?: number;
  gravity?: Gravity;
}

export default function transform(url: string, options: TransformationOptions | TransformationOptions[]) {
  const parsed = new URL(url);
  const query = parsed.pathname.split('/');
  const idx = query.indexOf('upload');
  const opts = Array.isArray(options) ? options : [options]; // coerce to array 
  // build string from each transformation
  const optStrings = opts.map(transformString);
  // insert the transformations into query params
  query.splice(idx, 0, ...optStrings);
  parsed.pathname = query.join('/');
  return parsed.toString();
}

function transformString(options: TransformationOptions) {
  const {crop, width, height, gravity} = options;
  let s = `c_${crop},w_${width}`;
  if (height) {
    s += `,h_${height}`;
  }
  if (gravity) {
    s += `,g_${gravity}`;
  }
  return s;
}
