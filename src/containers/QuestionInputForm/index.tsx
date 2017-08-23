import * as React from 'react';
import {observer, inject} from 'mobx-react';
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

interface QuestionInputFormState {
  question: Partial<Question>;
  errors: {} | null;
}

@inject('questionStore', 'uiStore', 'eventStore')
@observer
export default class QuestionInputForm extends React.Component<QuestionInputFormProps, QuestionInputFormState> {
  constructor(props: QuestionInputFormProps) {
    super(props);
    const {eventStore} = this.props;
    this.state = {
      question: {
        text: '',
        askedBy: '',
        forEvent: eventStore.selectedEvent ? eventStore.selectedEvent._id : '',
        toPerson: '' 
      },
      errors: null
    };

  }
  onSubmit = async (ev: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    ev.preventDefault();
    const question = {...this.state.question};
    if (question.forEvent === '') {
      question.forEvent = null;
    }
    if (question.toPerson === '') {
      question.toPerson = null;
    }
    const errors = await this.props.questionStore.submitQuestion(question);
    if (errors) {
      this.showErrors(errors);
    } else {
      // reset input state
      this.props.uiStore.questionInputOpen = false;
      this.setState({
        question: {
          text: '',
          askedBy: '',
          forEvent: this.props.eventStore.selectedEvent ? this.props.eventStore.selectedEvent._id : '',
          toPerson: '',
        }
      });
    }
  }



  showErrors(errors: any) { //tslint:disable-line

  }


  onInputChange = (value: string, field: string) => {
    this.setState({question: {...this.state.question, [field]: value}});
  }
  onEventSelect = (opt: Option) => {
    this.setState({question: {...this.state.question, forEvent: opt.value}});
    // const store = this.props.eventStore;
    // store.selectEvent(opt.value);
  }

  onSpeakerSelect = (opt: Option) => {
    this.props.eventStore.selectSpeaker(opt.value);
  }

  render() {
    const question = this.state.question;
    const { eventOptions, speakerOptions} = this.props.eventStore;
    return (
    <form tabIndex={-1} className={style.questionForm} onSubmit={this.onSubmit}>
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
          onChange={this.onInputChange} />
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
        <Button type="submit" style="normal" className={style.button} onSubmit={this.onSubmit}>Send</Button>
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
