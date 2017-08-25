import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Spinner from '../../components/Spinner';
const style = require('./LazyImage.pcss');

interface LazyImageProps {
  source: string;
  placeholder: string;
  method?: 'scroll' | 'immediate';
  width?: number | string;
  aspectRatio?: string | number; // should be defined to render correctly
  alt?: string;
}

interface LazyImageState {
  placeholderLoaded: boolean;
  sourceLoaded: boolean;
}

export default class LazyImage extends React.Component<LazyImageProps, LazyImageState> {
  static defaultProps: LazyImageProps = {
    aspectRatio: 1,
    source: '',
    placeholder: '',
    method: 'scroll',
  };

  constructor(props: LazyImageProps) {
    super(props);
    this.state = {
      placeholderLoaded: false,
      sourceLoaded: false,
    };
  }

  componentDidMount() {
    // TODO: source loading logic here
    this.loadImages();
  }

  async loadImages() {
    try {
      await fetch(this.props.placeholder);
      this.setState({placeholderLoaded: true});
      await fetch(this.props.source);
      this.setState({sourceLoaded: true});
    } catch (e) {
      // do nothing 
    }
  }

  renderPlaceholder() {
    const { placeholder, alt } = this.props;
    const { placeholderLoaded, sourceLoaded } = this.state;
    if (placeholderLoaded && !sourceLoaded) {
      return <img key="placeholder" alt={alt} src={placeholder} className={style.placeholder} />;
    } else {
      return null;
    }
  }

  renderOriginal() {
    const { source, alt } = this.props;
    const { sourceLoaded } = this.state;
    return sourceLoaded ? <img alt={alt} className={style.original} src={source}/> : null;
  }

  render() {
    let aspectRatio = this.props.aspectRatio;
    if (typeof aspectRatio === 'string') {
      const [num, denom] = aspectRatio.split(':').map((n) => parseFloat(n));
      aspectRatio = num / denom;
    }
    const width = this.props.width;
    return (
      <div className={style.container} style={{width}}>
        <div className={style.spacer} style={{paddingBottom: `${1 / aspectRatio * 100}%`}}/>
        <ReactCSSTransitionGroup
          transitionName={style}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {this.renderPlaceholder()}
          {this.renderOriginal()}
        <Spinner key="spinner"/> 
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
