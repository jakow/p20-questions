import * as React from 'react';
import {observer, inject} from 'mobx-react';
import * as classnames from 'classnames'
import Input from '../../components/Input';
import Button from '../../components/Button';
import {QuestionStore} from '../../models/QuestionStore';
const style = require('./QuestionInputPanel.pcss');

interface QuestionInputPanelProps {
  show: boolean;
  questionStore?: QuestionStore;
}

@inject('questionStore')
@observer
export default class QuestionInputPanel extends React.Component<QuestionInputPanelProps, null> {
  render() {
    const {show} = this.props;
    return (
    <div className={style.panelContainer}>
      <Overlay show={show}/>
    <Panel show={show}>
      <form className={style.questionForm}>
        <Input className={style.questionInput} id="question-text" onChange={this.onInputChange} />
        <Input className={style.questionInput} id="question-askedBy" onChange={this.onInputChange}/>

        <Button type="submit" style="transparent" className={style.questionSubmit} onClick={this.onSubmit}>Send</Button>
      </form>
    </Panel>
    </div>
    );
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const store = this.props.questionStore;
    if (e.target.id === 'question-text') {
      store.newQuestion.text = e.target.value;
    } else if (e.target.id === 'question-askedBy') {
      store.newQuestion.askedBy = e.target.value;
    }
  }

  onSubmit = async () => {
    this.props.questionStore.submitQuestion();
  }
}

interface ShowProps {
  show: boolean;
  children?: React.ReactNode;

}
function Overlay({show}: ShowProps) {
  return <div className={classnames(style.overlay, {[style.overlayShow]: show})}/>;
}

function Panel({show, children}: ShowProps) {
  return <div className={classnames(style.panel, {[style.panelShow]: show})}>{children}</div>;
} 
