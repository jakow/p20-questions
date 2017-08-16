import * as React from 'react';
import {observer, inject} from 'mobx-react';
import Select, {Option} from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {QuestionService} from '../../services/QuestionService';
import {UiService} from '../../services/UiService';
import {EventService} from '../../services/EventService';
const style = require('./QuestionInputForm.pcss');
interface QuestionInputFormProps {
  questionStore?: QuestionService;
  uiStore?: UiService;
  eventStore?: EventService;
}

@inject('questionStore', 'uiStore', 'eventStore')
@observer
export default class QuestionInputForm extends React.Component<QuestionInputFormProps, {}> {

  onSubmit = async (ev: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    ev.preventDefault();
    const errors = await this.props.questionStore.submitQuestion();
    if (errors) {
      console.log(errors);
    } else {
      this.props.uiStore.questionInputOpen = false;
    }
  }

  onInputChange = (field: string, value: string) => {
    this.props.questionStore.newQuestion[field] = value;
  }
  onEventSelect = (opt: Option) => {
    const store = this.props.eventStore;
    store.selectEvent(opt.value);
  }

  onSpeakerSelect = (opt: Option) => {
    this.props.eventStore.selectSpeaker(opt.value);
  }

  render() {
    const {newQuestion} = this.props.questionStore;
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
          value={newQuestion.text}
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
          value={newQuestion.askedBy}
          onChange={this.onInputChange} />
      </Field>
      <div className={style.buttonContainer}>
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
