import * as React from 'react';
import {QuestionDocument} from '../../models/Document';
import Question from '../Question'; 

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

// function byDateAccepted(a: QuestionDocument, b: QuestionDocument) {
//   if (!a.dateAccepted) {
//     return -1;
//   } else if (!b.dateAccepted) {
//     return 1;
//   } else {
//     const d1 = new Date(a.dateAccepted);
//     const d2 = new Date(a.dateAccepted);
//     return Number(d1) - Number(d2);
//   }
// }

export default QuestionList;