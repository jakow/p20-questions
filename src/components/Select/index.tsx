import * as React from 'react';

const style = require('./Select.pcss');
interface SelectProps {
  options: Array<Option | OptionGroup>;
  
  name: string;
  id: string;
  value?: string | Option; 
  onSelect?: (selected: Option) => void;
  label: string;
  labelStyle?: 'inline' | 'top' | 'option' | 'responsive';
  labelClass?: string;
  
  // for overriding styles
  className?: string;
}

/**
 * Externally controlled select input. Changes select behaviour to use Option objects
 * rather than strings as values
 */
export default class Select extends React.Component<SelectProps, null> {
  static defaultProps: Partial<SelectProps> = {
    labelStyle: 'top',
    options: [],
  };

  constructor(props: SelectProps) {
    super(props);
    // find first selected option
  }

  onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value || null;
    if (this.props.onSelect) {
      let option;
      if (value === null) {
        option = null;
      } else {
        option = this.optionsOnly().find((o) => o.value === value || o.name === ev.target.value);
      }
      this.props.onSelect(option);
    }
  }

  optionsOnly() { 
    const opts = [];
    for (const o of this.props.options) {
      if (isOpt(o)) {
        opts.push(o);
      } else {
        opts.push(...o.options);
      }
    }
    return opts;
  }

  render() {
    const {labelStyle, labelClass, options, id, label, className} = this.props;
    const containerClass = className || style[labelStyle + 'Container'];

    // use option value or option name or empty string
    let selectValueString = '';
    const value = this.props.value;
    if (typeof value === 'string') {
      selectValueString = value;
    } else if (isOpt(value)) {
      selectValueString = value.value || value.name;
    }

    return (
      <div className={containerClass}>
        <label className={labelClass} htmlFor={id}>{label}</label>
        <div className={style.selectContainer}>
          <select
          className={style.select}
          id={id}
          onChange={this.onChange}
          value={selectValueString}
          >
            {labelStyle === 'option' ? <option disabled={true} value="">{label}</option> : null}
            {options.map((o) => isOpt(o) ? <Opt key={o.value || o.name} {...o}/> : <OptGroup key={o.label} {...o}/>)}
          </select>
        <div className={style.icon}/>
        </div>
      </div>
    );
  }
}

export interface Option {
  name: string;
  value?: string;
  disabled?: boolean;
}

export interface OptionGroup {
  options: Option[];
  label?: string;
  disabled?: boolean;
}

function isOpt(o: {}): o is Option {
  if (o == null) {
    return false;
  }
  return typeof (o as any).name !== 'undefined'; //tslint:disable-line
}

function Opt({value, disabled, name}: Option) {
  return <option value={value} disabled={disabled}>{name}</option>;
}

function OptGroup({disabled, label, options}: OptionGroup) {
  return (
    <optgroup disabled={disabled} label={label}>
      {options != null ? options.map((o) => <Opt {...o}/>) : null}
    </optgroup>
  );
}
