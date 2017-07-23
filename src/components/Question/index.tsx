import * as React from 'react';
import {QuestionDocument} from '../../models/Document';
import './Question.css';

interface QuestionProps extends React.Props<QuestionProps> {
  question: QuestionDocument;
}

const Question = ({question}: QuestionProps) => {
  return (
    <div className="question">
      <p>{question.text}</p>
      {question.askedBy ? <p><small>Asked by: {question.askedBy}</small></p> : null}
    </div>
  );
};

export default Question;
