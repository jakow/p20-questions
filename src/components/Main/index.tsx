import * as React from 'react';
import CurrentQuestionList from '../../containers/CurrentQuestionList';
import QuestionFilter from '../../containers/QuestionFilter';
const style = require('./Main.pcss');

export default function Main() {
  return (
  <main className={style.main}>
    <div className={style.header}>
      <QuestionFilter/>
    </div>
    <div className={style.content}>
      <CurrentQuestionList/>  
    </div>
    
  </main>
  );
}