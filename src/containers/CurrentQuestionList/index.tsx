import * as React from 'react';
import {observer, inject} from 'mobx-react';
import Question from '../../components/Question';
import {QuestionStore} from '../../models/QuestionStore';
import {ApiStore} from '../../models/ApiStore';
import Overlay from '../../components/Overlay';
import Spinner from '../../components/Spinner';
const style = require('./CurrentQuestionList.pcss');

interface CurrentQuestionListProps {
  questionStore?: QuestionStore;
  apiStore?: ApiStore;
}

@inject('questionStore', 'apiStore') 
@observer 
class CurrentQuestionList extends React.Component<CurrentQuestionListProps, {}> {
  render () {
    const {questionStore, apiStore} = this.props;
    return (
    <div>
      <ol className={style.list}> { 
        questionStore.questionList.map((q) => (
        <li key={q._id}>
          <Question
          question={q} 
          showControls={apiStore.isLoggedIn}
          onChangeAcceptedState={(state) => q.accepted = state}
          onChangeArchivedState={(state) => q.archived = state}/></li>))  
      } </ol>
      <Overlay className={style.overlay} show={questionStore.pendingRequests > 0}><Spinner /></Overlay>
    </div>
    );
  }
}

export default CurrentQuestionList;
