import * as React from 'react';

const style = require('./Select.pcss');
interface SelectProps {
  options: Array<Option | OptionGroup>;
  
  name: string;
  id: string;
  value?: string; 
  onSelect?: (selected: Option) => void;
  label: string;
  labelStyle?: 'inline' | 'top' | 'option' | 'responsive';
  labelClass?: string;
  
  // for overriding styles
  className?: string;
  style?: React.CSSProperties;
}

interface SelectState {
  value: string;
}

export interface Option {
  name: string;
  label?: string;
  value?: string;
  disabled?: boolean;
}

export interface OptionGroup {
  options: Option[];
  label?: string;
  disabled?: boolean;
}

export default class Select extends React.Component<SelectProps, SelectState> {
  static defaultProps: Partial<SelectProps> = {
    labelStyle: 'top',
    options: [],
  };

  constructor(props: SelectProps) {
    super(props);
    // find first selected option
  
  }

  onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    const value = ev.target.value;
    this.setState({value});
    if (this.props.onSelect) {
      const opt = this.optionsOnly().find((o) => o.value === ev.target.value || o.name === ev.target.value);
      this.props.onSelect(opt);
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
    return(
      <div className={containerClass}>
        <label className={labelClass} htmlFor={id}>{label}</label>
        <div className={style.selectContainer}>
          <select
          className={style.select}
          id={id} style={style} 
          onChange={(ev) => this.onChange(ev)}
          value={this.props.value}
          >
          {/* placeholder as label */}
          {labelStyle === 'option' ? <option disabled={true} value="">{label}</option> : null}
          {options.map((o) => isOpt(o) ? <Opt key={o.label || o.name} {...o}/> : <OptGroup key={o.label} {...o}/>)}
          </select>
          <div className={style.icon}/>
        </div>
      </div>
    );
  }
}

function isOpt(o: Option | OptionGroup): o is Option {
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
