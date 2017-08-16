import * as React from 'react';
import {observer, inject} from 'mobx-react';
import QuestionInputForm from '..//QuestionInputForm';
import MorphingCloseButton from '../../components/MorphingCloseButton';
import Overlay from '../../components/Overlay';
import {QuestionService} from '../../services/QuestionService';
import {UiService} from '../../services/UiService';
import {EventService} from '../../services/EventService';
const style = require('./QuestionInputPanel.pcss');

interface QuestionInputPanelProps {
  questionStore?: QuestionService;
  uiStore?: UiService;
  eventStore?: EventService;
}

interface QuestionInputPanelState {
  panelHeight: number;
}

@inject('questionStore', 'uiStore', 'eventStore')
@observer
export default class QuestionInputPanel extends React.Component<QuestionInputPanelProps, QuestionInputPanelState> {
  // private panelHeight: number;
  private container: HTMLElement;
  private panelElement: HTMLElement;
  constructor(props: QuestionInputPanelProps) {
    super(props);
    this.state = {
      panelHeight: 320,
    };
  }

  onInputChange = (fieldName: string, value: string) => {
    this.props.questionStore.newQuestion[fieldName] = value;
  }

  onSubmit = async (ev: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    ev.preventDefault();
    const errors = await this.props.questionStore.submitQuestion();
    if (!errors) {
      this.close();
    }
  }

  open = () => {
    this.props.uiStore.questionInputOpen = true;
    this.container.focus();
  }

  toggle = () => {
    if (this.props.uiStore.questionInputOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  close = () => {
    this.props.uiStore.questionInputOpen = false;
  }

  handleAskButtonClick = (ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    ev.stopPropagation();
    this.toggle();
  }

  handleOverlayClick = (ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    this.close();
  }

  handleEscape = (ev: KeyboardEvent) => {
    if (ev.eventPhase !== ev.CAPTURING_PHASE && ev.keyCode === 27) { // escape
      this.close();
    }
  }

  componentDidMount() {
    // this.setState({panelHeight: this.panelElement.clientHeight});
    window.addEventListener('resize', this.updatePanelHeight);
    this.updatePanelHeight();
    // cycle the panel state to make it close?
  }

  componentDidUpdate() {
    this.updatePanelHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePanelHeight);
  }

  updatePanelHeight = () => {
    const newHeight = this.panelElement.clientHeight;
    if (newHeight !== this.state.panelHeight) {
      this.setState({panelHeight: newHeight});
    }
  }

  render() {
  // const {show} = this.props;
    const show = this.props.uiStore.questionInputOpen;
    const panelHeight = this.state.panelHeight;
    return (
      <div>
    <Overlay show={show} onClick={this.handleOverlayClick} className={style.overlay}/>
    <Panel show={show} height={panelHeight} onEscape={this.close} refElem={(elem) => this.container = elem}>

      <div className={style.panelButtons} onClick={this.handleOverlayClick}>
        <MorphingCloseButton isClose={show} onClick={this.handleAskButtonClick}>Ask a question</MorphingCloseButton>
      </div>

      <div className={style.panelMain} ref={(element) => this.panelElement = element}>
        <QuestionInputForm/>
      </div>
</Panel>
</div>
);
  }
}

interface PanelProps {
  height: number;
  show: boolean;
  children?: React.ReactNode;
  refElem?: (elem: HTMLDivElement) => void;
  onEscape?: () => void;
}
function Panel({height, children, show, refElem, onEscape}: PanelProps) {
  const offset = show ? 0 : -height;
  return (
  <div ref={refElem}
  className={show ? style.show : style.panel}
  onKeyDown={(ev) => {
    if (show && onEscape && ev.keyCode === 27) {
      onEscape();
    }
  }}
  style={{transform: `translateY(${-offset}px)`}}>{children}
  </div>);
}
