import * as React from 'react';
import classnames from 'classnames';
const style = require('./LazyImage.pcss');

interface LazyImageProps {
  source: string;
  placeholder: string;
  aspectRatio: string; // should be defined so that the 
  method?: 'scroll' | 'immediate';
  width?: number;
  height?: number;
}

interface LazyImageState {
  previewLoaded: boolean;
  sourceLoaded: boolean;
}
interface SpinnerProps {
  visible: boolean;
}
const Spinner = (props: SpinnerProps) => (
  <div className={classnames(style.spinner, props.visible && style.spinnerVisible)}
      style={{backgroundImage: require('../../../public/spinner.svg')}}/>);

export default class LazyImage extends React.Component<LazyImageProps, LazyImageState> {
  static defaultProps: LazyImageProps = {
    aspectRatio: '1:1',
    source: '',
    placeholder: '',
    method: 'scroll',
  };
  private containerElement: HTMLElement;

  constructor(props: LazyImageProps) {
    super(props);
  }

  componentDidMount() {
    // TODO: source loading logic here
    console.log(this.containerElement);
  }

  render() {
    const {placeholder, source} = this.props;
    const {previewLoaded, sourceLoaded} = this.state;
    return (
      <div className={style.lazyImageContainer} ref={(d) => this.containerElement = d}>
        <Spinner visible={!this.state.sourceLoaded}/> 
        <img src={placeholder} className={classnames(style.placeholder, previewLoaded && style.placeholderVisible)}/>
        <img src={sourceLoaded ? source : undefined}/>
      </div>
    );
  }
}
