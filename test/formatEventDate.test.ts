import format from '../src/helpers/formatEventTime';

describe('formatEventTime()', () => {
  it('formats with a start date only', () => {
    const val = format(new Date('2017/11/18 9:00'));
    expect(val).toBe('18th November, from 09:00');
  });

  it('formats with end date only', () => {
    const val = format(null, new Date('2017/11/18 11:00'));
    expect(val).toBe('18th November, until 11:00');
  });

  it('formats with a start date and and end date', () => {
    const val = format(new Date('2017/11/18 9:00'), new Date('2017/11/18 11:00'));
    expect(val).toBe('18th November, 09:00–11:00');
  });
});
