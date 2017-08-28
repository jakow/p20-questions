import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {flatMap} from 'lodash';

import Select, {Option} from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Question} from '../../models/Question';
import QuestionStore from '../../services/QuestionStore';
import UiStore from '../../services/UiStore';
import EventStore from '../../services/EventStore';

const style = require('./QuestionInputForm.pcss');

interface QuestionInputFormProps {
  questionStore?: QuestionStore;
  uiStore?: UiStore;
  eventStore?: EventStore;
}

interface QuestionInputFormErrors {
  text: string[];
}

interface QuestionInputFormState {
  question: Partial<Question>;
  errors: QuestionInputFormErrors | null;
}

@inject('questionStore', 'uiStore', 'eventStore')
@observer
export default class QuestionInputForm extends React.Component<QuestionInputFormProps, QuestionInputFormState> {
  constructor(props: QuestionInputFormProps) {
    super(props);
    const {selectedEvent} = this.props.eventStore;
    this.state = {
      question: {
        text: '',
        askedBy: '',
        forEvent: selectedEvent ? selectedEvent._id : null,
        toPerson: null,
      },
      errors: null,
    };
  }

  componentWillReceiveProps(newPros: QuestionInputFormProps) {
    if (!this.props.uiStore.questionInputOpen) {
      // clear errors
      this.showErrors(null);
    }
  }
  
  onSubmit = async (ev: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    ev.preventDefault();
    const question = this.state.question;
    const errors = await this.props.questionStore.submitQuestion(question);
    if (errors) {
      this.showErrors(errors);
    } else {
      // success, reset input state and close modal
      this.props.uiStore.questionInputOpen = false;
      this.resetQuestion();
    }
  }

  showErrors(errors: any) { //tslint:disable-line
    this.setState({errors});
  }

  resetQuestion() {
    this.setState({
      question: {
        text: '',
        askedBy: '',
        forEvent: this.props.eventStore.selectedEvent ? this.props.eventStore.selectedEvent._id : null,
        toPerson: null,
      },
    });
  }

  onInputChange = (value: string, field: string) => {
    this.setState({question: {...this.state.question, [field]: value}});
  }

  onEventSelect = (opt: Option | null) => {
    const eventId = opt!.value;
    const question = this.state.question;
    question.forEvent = eventId;
    let event;
    if (eventId) {
      event = this.props.eventStore.events.get(eventId);
    }
    // clear speaker selection
    if (event != null && event.speakers.indexOf(this.state.question.toPerson as string) === -1) {
      this.onSpeakerSelect(null);
    }
    this.setState({question});

  }

  onSpeakerSelect = (opt: Option) => {
    this.setState({question: {...this.state.question, toPerson: opt ? opt.value : null}});
  }

  renderErrors() {
    const errors = this.state.errors;
    if (!errors) {
      return null;
    } else {
      const errorList = flatMap(errors);
      console.log(errors);
      return <ul className={style.errorList}>{errorList.map((e) => <li key={e.toString()}>{e}</li>)}</ul>;
    }
  }

  speakerOptions() {
    const selectedEventId = this.state.question.forEvent as string;
    let speakers = this.props.eventStore.speakerList;
    if (selectedEventId) {
      const selectedEvent = this.props.eventStore.events.get(selectedEventId);
      speakers = speakers.filter(s => selectedEvent.speakers.indexOf(s._id) !== -1);
    }
    const options = speakers.map(s => ({ name: s.name, value: s._id }));
    options.unshift({name: 'Any speaker', value: null});
    return options;
  }

  eventOptions() {
    const options = this.props.eventStore.eventList.map((e) => ({ name: e.name, value: e._id }));
    options.unshift({name: 'Any event', value: null});
    return options;
  }

  render() {
    const question = this.state.question;
    const eventOptions = this.eventOptions();
    const speakerOptions = this.speakerOptions();
    const {validateQuestionText} = this.props.questionStore;
    return (
    <form className={style.questionForm} onSubmit={this.onSubmit}>
      <Field>
        <Input
          type="textarea"
          label="Your question"
          name="text"
          id="question-text"
          labelAsPlaceholder={true}
          className={style.input}
          labelClass={style.label}
          value={question.text}
          onChange={this.onInputChange}
          validator={validateQuestionText}
          validatorDelay={500}/>
      </Field>

      <Field>
        <Select
          name="forEvent"
          label="About"
          id="question-forEvent"
          labelStyle="inline"
          className={style.selectContainer}
          labelClass={style.selectLabel}
          options={eventOptions}
          value={question.forEvent as string}
          onSelect={this.onEventSelect} />
      </Field>
      <Field>
        <Select
          name="toPerson"
          label="For"
          id="question-toPerson"
          labelStyle="inline"
          className={style.selectContainer}
          labelClass={style.selectLabel}
          options={speakerOptions}
          value={question.toPerson}
          onSelect={this.onSpeakerSelect} />
      </Field>
      <Field>
        <Input
          label="Your name"
          name="askedBy"
          id="question-askedBy"
          labelAsPlaceholder={true}
          className={style.input}
          labelClass={style.label}
          value={question.askedBy}
          onChange={this.onInputChange} />
      </Field>
      <div className={style.footer}>
        <div className={style.errorContainer}>
          {this.renderErrors()}
        </div>
        <div className={style.buttonContainer}>
          <Button type="submit" style="normal" className={style.button} onSubmit={this.onSubmit}>Send</Button>
        </div>
      </div>

    </form>);
  }
}

interface FieldProps {
  children?: React.ReactNode;
}

function Field(props: FieldProps) {
  return <div className={style.field}>{props.children}</div>;
}
