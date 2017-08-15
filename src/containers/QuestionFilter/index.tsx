import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {EventStore} from '../../models/EventStore';
import {QuestionStore} from '../../models/QuestionStore';
import Select, {Option} from '../../components/Select';
const style = require('./QuestionFilter.pcss');
interface QuestionFilterProps {
  eventStore?: EventStore;
  questionStore?: QuestionStore;
}

interface QuestionFilterState {

}

@inject('eventStore', 'questionStore')
@observer
export default class QuestionFilter extends React.Component<QuestionFilterProps, QuestionFilterState> {
  
  render() {
    const options = this.props.questionStore.eventOptions;
    let value = '';
    if (this.props.questionStore.selectedEvent != null) {
      value = this.props.questionStore.selectedEvent._id;
    }
    return (
      <div className={style.container}>
        <div className={style.selectContainer}>
          <Select 
            name="optionFilter" 
            id="question-filter"
            value={value}
            options={options} 
            onSelect={this.onSelect}
            label="Showing questions about:"
            labelStyle="responsive"
            />
          </div>
      </div>
);
  }

  onSelect = (opt: Option) => {
    this.props.questionStore.selectEvent(opt.value);
  }
}