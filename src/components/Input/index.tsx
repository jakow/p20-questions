import * as React from 'react';
import {observer} from 'mobx-react';
import TextareaAutosize from 'react-textarea-autosize';
const style = require('./Input.pcss');

interface InputProps {
  id: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: 'text' | 'password' | 'tel' | 'url' | 'textarea' | 'email';
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  // onEnter?: (inputValue: string) => void;
  placeholder?: string;
  label?: string;
  labelAsPlaceholder?: boolean;
  autoFocus?: boolean;
  rows?: number; // for textarea
  labelClass?: string;
  className?: string;
  autoComplete?: 'on' | 'off';
  maxLength?: number;
  minLength?: number;
  error?: boolean | string;
}

/**
 *  use this component for text inputs only. The input value must be bound to mobx state.
 */
@observer
export default class Input extends React.Component<InputProps, {}> {
  static defaultProps: Partial<InputProps> = {
    type: 'text',
    className: '',
    labelAsPlaceholder: false,
    autoComplete: 'off',
    rows: 1,
  };

  constructor(props: InputProps) {
    super(props);
  }

  render() {
    const {
      value, 
      autoFocus, 
      placeholder, 
      rows, 
      className,
      type, 
      autoComplete, 
      id, 
      label, 
      name, 
      labelClass,
      // maxLength,
      // minLength,
    } = this.props;
    return (
    <div className={className || style.input}>
    {type === 'textarea' ?
      (
        <TextareaAutosize
          autoFocus={autoFocus}
          value={value}
          rows={rows} 
          id={id} 
          name={name}
          placeholder={placeholder} 
          onChange={this.onChange} 
          onKeyDown={this.onKeyDown}/>
      ) : (
        <input 
          autoFocus={autoFocus}
          id={id} 
          placeholder={placeholder} 
          name={name} 
          type={type} 
          autoComplete={autoComplete} 
          value={value} 
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}/>
      )
    }
    <Label htmlFor={id} className={labelClass} text={label} asPlaceholder={this.props.labelAsPlaceholder} 
      show={!!!value}/>
    </div>);
 }

 onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.props.onChange(event.target.name, event.target.value);
 }

 onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
   if (this.props.onKeyDown) {
     this.props.onKeyDown(event);
   }
 }

}
interface LabelProps {
  htmlFor: string;
  text: string;
  className: string;
  show: boolean;
  asPlaceholder: boolean;
}

function Label({htmlFor, text, className, show, asPlaceholder}: LabelProps) {
  return text ? (
    <label className={className || style.label} htmlFor={htmlFor} 
      style={{visibility: (!asPlaceholder || show) ? 'visible' : 'hidden'}}>{text}</label>
    ) : null;
}