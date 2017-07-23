import * as React from 'react';
import Input from '../../components/Input';

interface QuestionInputProps {

}

export default class QuestionInput extends React.Component<QuestionInputProps, {}> {
  render() {
    return (
    <div>
      <Input id="question-input" onEnter={this.submitQuestion}/>
      <a className="question-input__submit" onClick={this.submitQuestion} href="#">Submit</a>
    </div>
    );
  }

  submitQuestion = () => {
    console.log('Submit!');
  }
}
