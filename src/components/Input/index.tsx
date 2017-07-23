import * as React from 'react';
import './Input.css';

const ENTER = 13;

interface InputState {
  value: string;
}

interface InputProps {
  id: string;
  type?: string;
  onChange?: (val: string) => void;
  onEnter?: (inputValue: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;

}

export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps: Partial<InputProps> = {
    type: 'text',
    className: '',
  };

  constructor(props: InputProps) {
    super(props);
    this.state = {value: ''};
  }
 render() {
   return (
     <div className={this.props.className + ' text-input'}>
      <input placeholder={this.props.placeholder}
        type={this.props.type}
        value={this.state.value} 
        onChange={this.onChange}
        onKeyDown={(event) => this.detectEnter(event)}
        id={this.props.id}/>
      {this.props.label ? <label htmlFor={this.props.id}>{this.props.label}</label> : null}
    </div>);
 }

 onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const value = event.target.value;
   this.setState({value});
   if (this.props.onChange) {
     this.props.onChange(value);
   }
 }

 detectEnter(event: React.KeyboardEvent<HTMLInputElement>) {
   if (event.keyCode === ENTER && this.props.onEnter) {
    this.props.onEnter(this.state.value);
    event.preventDefault();
   }
 }

}
