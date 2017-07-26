import * as React from 'react';
import CurrentQuestionList from '../../containers/CurrentQuestionList';
const style = require('./Main.pcss');
import QuestionInputPanel from '../../containers/QuestionInputPanel';

const Main = () => (
  <main className={style.main}>
    <div className={style.mainTop}>
      <CurrentQuestionList/>
    </div>
    <div className={style.mainBottom}>
      <QuestionInputPanel show={true}/>
    </div>
  </main>);

export default Main;