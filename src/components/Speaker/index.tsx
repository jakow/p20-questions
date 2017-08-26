import * as React from 'react';
import LazyImage from '../../components/LazyImage';
import {Speaker} from '../../models/Speaker';
// import imgTransform from '../../helpers/cloudinary';
const style = require('./Speaker.pcss');

interface SpeakerProps {
  speaker: Speaker;
}

export default function SpeakerComponent({speaker}: SpeakerProps) {
  const photo = speaker.photo.secure_url;
  // const source = imgTransform(photo, {crop: 'limit', gravity: 'center', width: 120}); 
  // const placeholder = imgTransform(photo, {crop: 'limit', gravity: 'center', width: 32}); 
  const source = photo;
  const placeholder = photo;
  return (
    <div className={style.speaker}>
      <div className={style.photo}>
        <LazyImage alt={speaker.name} source={source} placeholder={placeholder}/>
      </div>
      <div className={style.name}>{speaker.name}</div>
    </div>
  );
}
