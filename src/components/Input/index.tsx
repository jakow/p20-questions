import * as React from 'react';
import {observer} from 'mobx-react';
import {debounce} from 'lodash';
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
  // functional validator 
  validator?: (v: string) => false | string | string[];
  // external validator
  isValid?: boolean | string;
  // as you type, you don't want red flashing at you. This prop debounces the input 
  validatorDelay?: number;
}

interface InputState {
  pristine: boolean;
  valid: boolean;
  errors: string[];
}

/**
 *  use this component for text inputs only. The input value should be bound to mobx state.
 */
@observer
export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps: Partial<InputProps> = {
    type: 'text',
    className: style.input,
    invalidClassName: style.invalid,
    labelAsPlaceholder: false,
    autoComplete: 'off',
    rows: 1,
  };
  
  private debouncedValidate: () => void;

  constructor(props: InputProps) {
    super(props);
    this.state = {
      pristine: true,
      valid: true,
      errors: null,
    };
    if (this.props.validatorDelay) {
      this.debouncedValidate = debounce(() => this.validate() , this.props.validatorDelay);
    }

  }

  componentWillReceiveProps(props: InputProps) {
    if (this.props.validatorDelay !== props.validatorDelay) {
      this.debouncedValidate = debounce(() => this.validate(), this.props.validatorDelay);
    }
  }

  render() {
    const { className, invalidClassName, label, labelClass, id, value, labelAsPlaceholder } = this.props;
    const { pristine, valid } = this.state;
    const classes = classnames(className, (!pristine && !valid) ? invalidClassName : null);
    return (
      <div className={classes}>
        {this.renderInput()}
        <Label htmlFor={id} className={labelClass} asPlaceholder={labelAsPlaceholder}
          show={value === ''}>{label}</Label>
      </div>);
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

  onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (this.state.pristine) {
      this.setState({pristine: false});
    }
    if (this.props.validatorDelay) {
      this.debouncedValidate();
    } else {
      this.validate();
    }
    this.props.onChange(event.target.value, event.target.name);
  }

 onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
   if (this.props.onKeyDown) {
     this.props.onKeyDown(event);
   }
 }

 validate() {
   let valid = true;
   let errors = null;
   if (typeof this.props.isValid !== 'undefined') {
     valid = this.props.isValid === true;
   } else if (typeof this.props.validator !== 'undefined') {
     const validatorResult = this.props.validator(this.props.value);
     valid = validatorResult === true;
     if (Array.isArray(validatorResult)) {
       errors = validatorResult;
     } else if (typeof validatorResult === 'string') {
       errors = [validatorResult];
     }
   }
   this.setState({ valid, errors });
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