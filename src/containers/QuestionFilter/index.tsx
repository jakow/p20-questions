import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {EventService} from '../../services/EventService';
import {QuestionService} from '../../services/QuestionService';
import Select, {Option} from '../../components/Select';
const style = require('./QuestionFilter.pcss');
interface QuestionFilterProps {
  eventStore?: EventService;
  questionStore?: QuestionService;
}

interface QuestionFilterState {

}

@inject('eventStore', 'questionStore')
@observer
export default class QuestionFilter extends React.Component<QuestionFilterProps, QuestionFilterState> {
  
  render() {
    const evStore = this.props.eventStore;
    const options = evStore.eventOptions;
    let value = '';
    if (this.props.eventStore.selectedEvent != null) {
      value = evStore.selectedEvent._id;
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
    this.props.eventStore.selectEvent(opt.value);
  }
}