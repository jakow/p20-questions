import * as React from 'react';
import {observer, inject} from 'mobx-react';
import Select, {Option} from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {QuestionStore} from '../../models/QuestionStore';
import {UiStore} from '../../models/UiStore';
const style = require('./QuestionInputForm.pcss');
interface QuestionInputFormProps {
  questionStore?: QuestionStore;
  uiStore?: UiStore;
}

@inject('questionStore', 'uiStore')
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
    const event = this.props.questionStore.selectEvent(opt.value);
    const speaker = this.props.questionStore.selectedSpeaker;
    if (event && event.speakers.indexOf(speaker) < 0) {
      this.props.questionStore.selectedSpeaker = null;
    }
  }

  onSpeakerSelect = (opt: Option) => {
    this.props.questionStore.selectSpeaker(opt.value);
  }

  render() {
    const {newQuestion, eventOptions, speakerOptions} = this.props.questionStore;
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
