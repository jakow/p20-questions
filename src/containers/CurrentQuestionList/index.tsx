import * as React from 'react';
import {observer, inject} from 'mobx-react';
import QuestionComponent from '../../components/Question';
import {QuestionService} from '../../services/QuestionService';
import {ApiService} from '../../services/ApiService';
import Overlay from '../../components/Overlay';
import Spinner from '../../components/Spinner';
const style = require('./CurrentQuestionList.pcss');

interface CurrentQuestionListProps {
  questionStore?: QuestionService;
  apiStore?: ApiService;
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
          <QuestionComponent
          question={q} 
          showControls={apiStore.isLoggedIn}
          onChangeAcceptedState={(state) => q.accepted = state}
          onChangeArchivedState={(state) => q.archived = state}/></li>))  
      } </ol>
      <Overlay className={style.overlay} show={questionStore.fetching}><Spinner /></Overlay>
    </div>
    );
  }
}

export default CurrentQuestionList;
