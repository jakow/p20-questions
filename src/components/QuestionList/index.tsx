import * as React from 'react';
import Question from '../Question'; 
import {Question as QuestionDocument} from '../../models/Question';

const style = require('./QuestionList.pcss');

export interface QuestionListProps {
  questions: QuestionDocument[];
}
const QuestionList = ({questions}: QuestionListProps) => {
  return (
  <ol className={style.list}>
    {questions.map((q) => (<li key={q._id}><Question question={q}/></li>))}
  </ol>);
};

export default QuestionList;