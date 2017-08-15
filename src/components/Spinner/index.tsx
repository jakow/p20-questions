import * as React from 'react';
const style = require('./Spinner.pcss');

interface SpinnerProps {
  size?: number;
}
export default function Spinner({size}: SpinnerProps) {
  return <span className={style.spinner}/>;
}