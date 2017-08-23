import * as React from 'react';
import {inject, observer} from 'mobx-react';
import EventStore from '../../services/EventStore';
import QuestionStore from '../../services/QuestionStore';
import ApiStore from '../../services/ApiStore';
import {QuestionFilter as Filter, QuestionSort as Sort} from '../../models/Question';
import Select, {Option} from '../../components/Select';
const style = require('./QuestionFilter.pcss');

interface QuestionFilterProps {
  eventStore?: EventStore;
  questionStore?: QuestionStore;
  apiStore?: ApiStore;
}

const filterOptions = [
  { name: 'Accepted',   value: Filter.ACCEPTED.toString() },
  { name: 'Unarchived', value: Filter.UNARCHIVED.toString() },
  { name: 'All',        value: Filter.ALL.toString() },
];

const sortOptions = [
  {name: 'By date added',    value: Sort.BY_DATE_ADDED.toString()},
  {name: 'By date accepted', value: Sort.BY_DATE_ACCEPTED.toString()},
];

@inject('eventStore', 'questionStore', 'apiStore')
@observer
export default class QuestionFilter extends React.Component<QuestionFilterProps, null> {
  renderEventSelect() {
    const eventStore = this.props.eventStore;
    const eventOptions = eventStore.eventOptions;
    let value = '';
    if (eventStore.selectedEvent != null) {
      value = eventStore.selectedEvent._id;
    }
    return (
      <div className={style.selectContainer}>
        <Select
          name="event-filter"
          id="qfilter-event-filter"
          value={value}
          options={eventOptions}
          onSelect={this.onEventSelect}
          label="Showing questions about:"
          labelStyle="top"
        />
      </div>
    );
  }

  renderFilter() {
    return (
      <div className={style.selectContainer}>
        <Select
          name="question-filter"
          id="qfilter-question-filter"
          options={filterOptions}
          onSelect={this.onFilterSelect}
          label="Filter questions:"
          labelStyle="top"
        />
     </div>);
  }

  renderSort() {
    return (
      <div className={style.selectContainer}>
        <Select
          name="question-sort"
          id="qfilter-question-sort"
          options={sortOptions}
          onSelect={this.onSortSelect}
          label="Sort questions:"
          labelStyle="top"
        />
      </div>);
  }

  render() {

    const isLoggedIn = this.props.apiStore.isLoggedIn;
    // const

    return (
      <div className={style.container}>
          {this.renderEventSelect()}
          {isLoggedIn ? this.renderFilter() : null}
          {isLoggedIn ? this.renderSort() : null}
      </div>
);
  }

  onEventSelect = (opt: Option) => {
    this.props.eventStore.selectEvent(opt.value);
  }

  onSortSelect = (opt: Option) => {
    this.props.questionStore.sort = +opt.value as Sort;
  }

  onFilterSelect = (opt: Option) => {
    this.props.questionStore.filter = +opt.value as Filter;
  }
}