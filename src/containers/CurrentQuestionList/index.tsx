import * as React from 'react';
import {observer, inject} from 'mobx-react';
import Question from '../../components/Question';
import QuestionStore from '../../services/QuestionStore';
import ApiStore from '../../services/ApiStore';
import EventStore from '../../services/EventStore';
import UiStore from '../../services/UiStore';
import Overlay from '../../components/Overlay';
import Spinner from '../../components/Spinner';
const style = require('./CurrentQuestionList.pcss');

interface CurrentQuestionListProps {
  questionStore?: QuestionStore;
  apiStore?: ApiStore;
  uiStore?: UiStore;
  eventStore?: EventStore;
}

@inject('questionStore', 'apiStore', 'uiStore', 'eventStore') 
@observer 
class CurrentQuestionList extends React.Component<CurrentQuestionListProps, {}> {
  render () {
    const {questionStore, apiStore, uiStore, eventStore} = this.props;
    // substitute person ids with person data
    const questions = questionStore.questionList.map(q => {
      if (typeof q.toPerson === 'string') {
        const person = eventStore.speakers.get(q.toPerson);
        q.toPerson = person || null;
      }
      return q;
    });
    return (
    <div>
      <ol className={style.list}> { 
        questions.map((q) => (
        <li key={q._id}>
          <Question
          question={q} 
          showControls={apiStore.isLoggedIn}
          onChangeAcceptedState={(accepted) => questionStore.sendQuestionToServer(q, {accepted})}
          onChangeArchivedState={(archived) => questionStore.sendQuestionToServer(q, {archived})}/></li>))  
      } </ol>
      <Overlay className={style.overlay} show={uiStore.fetchingQuestions}><Spinner /></Overlay>
    </div>
    );
  }
}

export default CurrentQuestionList;
