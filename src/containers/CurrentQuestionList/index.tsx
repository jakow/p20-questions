import * as React from 'react';
import {observer} from 'mobx-react';
import QuestionList from '../../components/QuestionList';
import {QuestionStore} from '../../models/Store';
// import {QuestionDocument} from '../../data/Document';
interface CurrentQuestionListProps {
  store: QuestionStore;
}
const CurrentQuestionList = observer(({store}: CurrentQuestionListProps) => (
  <QuestionList questions={store.questionsByDateAdded}/>
));

export default CurrentQuestionList;
