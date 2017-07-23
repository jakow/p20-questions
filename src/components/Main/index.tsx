import * as React from 'react';
import './Main.css';
import CurrentQuestionList from '../../containers/CurrentQuestionList';
import QuestionInput from '../../containers/QuestionInput';
import {questionStore} from '../../App';
const Main = (props: React.Props<{}>) => (
  <main className="main">
    <CurrentQuestionList store={questionStore}/>
    <QuestionInput/>
  </main>);

export default Main;