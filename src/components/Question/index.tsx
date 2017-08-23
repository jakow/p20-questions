import * as React from 'react';
import * as classnames from 'classnames';
import QuestionControls from '../QuestionControls';
import {Question} from '../../models/Question';
const style = require('./Question.pcss');

interface QuestionProps extends React.Props<QuestionProps> {
  question: Question;
  showControls?: boolean;
  onChangeAcceptedState?: (accepted: boolean) => void;
  onChangeArchivedState?: (archived: boolean) => void;
}

export default function QuestionComponent(
  {question, showControls, onChangeAcceptedState, onChangeArchivedState}: QuestionProps) {
  return (
    <div className={classnames(style.question, question.accepted ? style.accepted : null)}>
      <div className={style.main}>
      {question.toPerson && typeof question.toPerson !== 'string' ? 
        <p className={style.to}>To {question.toPerson.name}:</p> : null}
      <p className={style.text}>{question.text}</p>
      <div className={style.meta}>

        {question.askedBy ? <p className={style.askedBy}><small>Asked by: {question.askedBy}</small></p> : null}
      </div>
    </div>
    {showControls ? (
      <div className={style.aside}> 
        <QuestionControls
          accepted={question.accepted} archived={question.archived}
          onChangeAcceptedState={onChangeAcceptedState}
          onChangeArchivedState={onChangeArchivedState}
        /> 
      </div>) : null
    } 
    </div>
  );
};
