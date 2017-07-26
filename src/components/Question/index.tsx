import * as React from 'react';
import * as classnames from 'classnames';
import {QuestionDocument} from '../../models/Document';
const style = require('./Question.pcss');

interface QuestionProps extends React.Props<QuestionProps> {
  question: QuestionDocument;
}

const Question = ({question}: QuestionProps) => {
  return (
    <div className={classnames(style.question, question.accepted ? style.accepted : null)}>
      <p>{question.text}</p>
      {question.askedBy ? <p><small>Asked by: {question.askedBy}</small></p> : null}
    </div>
  );
};

export default Question;
