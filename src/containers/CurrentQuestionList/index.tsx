import * as React from 'react';
import {observer, inject} from 'mobx-react';
import QuestionList from '../../components/QuestionList';
import {QuestionStore} from '../../models/QuestionStore';
// import {QuestionDocument} from '../../data/Document';

interface CurrentQuestionListProps {
  questionStore?: QuestionStore;
}

@inject('questionStore') 
@observer 
class CurrentQuestionList extends React.Component<CurrentQuestionListProps, {}> {
  render () {
    return (<QuestionList questions={this.props.questionStore.questionsByDateAdded}/>);
  }
}

export default CurrentQuestionList;
