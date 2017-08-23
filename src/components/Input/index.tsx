import * as React from 'react';
import {observer} from 'mobx-react';
import * as classnames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
const style = require('./Input.pcss');

interface InputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string, name: string) => void;
  type?: 'text' | 'password' | 'tel' | 'url' | 'textarea' | 'email';
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  labelAsPlaceholder?: boolean;
  autoFocus?: boolean;
  rows?: number; // for textarea
  labelClass?: string;
  className?: string;
  invalidClassName?: string;
  autoComplete?: 'on' | 'off';
  // validation
  validator?: (v: string) => boolean | string;
  isValid?: boolean;
}

/**
 *  use this component for text inputs only. The input value must be bound to mobx state.
 */
@observer
export default class Input extends React.Component<InputProps, {}> {
  static defaultProps: Partial<InputProps> = {
    type: 'text',
    className: style.input,
    invalidClassName: style.invalid,
    labelAsPlaceholder: false,
    autoComplete: 'off',
    rows: 1,
  };

  constructor(props: InputProps) {
    super(props);
  }

  renderInput() {
    const { value, autoFocus, placeholder, rows, type, autoComplete, id, name} = this.props;
    return type === 'textarea' ?
      (
        <TextareaAutosize
          autoFocus={autoFocus}
          value={value}
          rows={rows}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown} />
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
          onKeyDown={this.onKeyDown} />
      );
  }

  render() {
    const {className, invalidClassName, label, labelClass, id, value} = this.props;
    return (
    <div className={classnames(className, this.valid && invalidClassName)}>
    {this.renderInput()}
    <Label htmlFor={id} className={labelClass} asPlaceholder={this.props.labelAsPlaceholder} 
      show={value === ''}>{label}</Label>
    </div>);
 }

 onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
   this.props.onChange(event.target.value, event.target.name);
 }

 onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
   if (this.props.onKeyDown) {
     this.props.onKeyDown(event);
   }
 }

 get valid(): boolean {
    if (typeof this.props.isValid !== 'undefined') {
      return this.props.isValid;
    } else if (typeof this.props.validator !== 'undefined') {
      return this.props.validator(this.props.value) === true;
    } else {
      return true;
    }
  }

}

interface LabelProps {
  htmlFor: string;
  children: string;
  className: string;
  show: boolean;
  asPlaceholder: boolean;
}

function Label({htmlFor, className, show, asPlaceholder, children}: LabelProps) {
    return (
    <label 
      className={className || style.label} 
      htmlFor={htmlFor} 
      style={{visibility: (!asPlaceholder || show) ? 'visible' : 'hidden'}}>
    {children}
    </label>);
}