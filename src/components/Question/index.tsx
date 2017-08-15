import * as React from 'react';
import * as classnames from 'classnames';
import QuestionControls from '../QuestionControls';
import {QuestionDocument} from '../../models/Document';
const style = require('./Question.pcss');

interface QuestionProps extends React.Props<QuestionProps> {
  question: QuestionDocument;
  showControls?: boolean;
  onChangeAcceptedState?: (accepted: boolean) => void;
  onChangeArchivedState?: (archived: boolean) => void;
}

const Question = ({question, showControls, onChangeAcceptedState, onChangeArchivedState}: QuestionProps) => {
  return (
    <div className={classnames(style.question, question.accepted ? style.accepted : null)}>
      <p>{question.text}</p>
      <div className={style.meta}>
        {showControls ? (
            <QuestionControls 
            accepted={question.accepted} archived={question.archived} 
            onChangeAcceptedState={onChangeAcceptedState} 
            onChangeArchivedState={onChangeArchivedState}
          />) : null
        }
        {question.askedBy ? <p className={style.askedBy}><small>Asked by: {question.askedBy}</small></p> : null}
      </div>
    </div>
  );
};

export default Question;
