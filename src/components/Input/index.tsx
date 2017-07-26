import * as React from 'react';
import * as classnames from 'classnames';
const style = require('./Input.pcss');

interface InputState {
  value: string;
}

interface InputProps {
  id: string;
  type?: 'text' | 'password' | 'tel' | 'url';
  onChange?: (val: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (val: React.KeyboardEvent<HTMLInputElement>) => void;
  // onEnter?: (inputValue: string) => void;
  placeholder?: string;
  label?: string;
  labelAsPlaceholder?: boolean;
  className?: string;
  autoComplete?: 'on' | 'off';
}

/**
 *  use this component from text inputs only.
 */
export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps: Partial<InputProps> = {
    type: 'text',
    className: '',
    labelAsPlaceholder: false,
    autoComplete: 'off',
  };

  constructor(props: InputProps) {
    super(props);
    this.state = {value: ''};
  }
  render() {
    const {placeholder, className, type, autoComplete, id, label, labelAsPlaceholder} = this.props;
    return (
    <div className={classnames(style.input, className)}>
    <input placeholder={placeholder}
      autoComplete={autoComplete}
      type={type}
      value={this.state.value} 
      onChange={this.onChange}
      onKeyDown={this.onKeyDown}
      id={id}/>
    {label ? 
      <label className={labelAsPlaceholder ? style.placeholderLabel : style.label} htmlFor={id}>{label}</label> :
      null}
    </div>);
 }

 onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const value = event.target.value;
   this.setState({value});
   if (this.props.onChange) {
     this.props.onChange(event);
   }
 }

 onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
   if (this.props.onKeyDown) {
     this.props.onKeyDown(event);
   }
 }


//  detectEnter(event: React.KeyboardEvent<HTMLInputElement>) {
//    if (event.keyCode === ENTER && this.props.onEnter) {
//     this.props.onEnter(this.state.value);
//     event.preventDefault();
//    }
//  }

}
