import * as moment from 'moment';

export default function format(start?: Date, end?: Date) {
  let startMoment;
  let endMoment;
  if (start) {
    startMoment = moment(start);
  }
  if (end) {
    endMoment = moment(end);
  }
  if (!startMoment && endMoment) {
    return `${endMoment.format('Do MMMM')}, until ${endMoment.format('HH:mm')}`;
  } else if (startMoment && !endMoment) {
    return `${startMoment.format('Do MMMM')}, from ${startMoment.format('HH:mm')}`;
  } else {
    return `${startMoment.format('Do MMMM')}, ${startMoment.format('hh:mm')}–${endMoment.format('hh:mm')}`;
  }
}
