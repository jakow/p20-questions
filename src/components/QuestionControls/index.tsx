import * as React from 'react';
import Button from '../Button';
const style = require('./QuestionControls.pcss');

interface QuestionControlsProps {
  accepted?: boolean;
  archived?: boolean;
  onChangeAcceptedState?: (accepted: boolean) => void;
  onChangeArchivedState?: (archived: boolean) => void;

}

export default class QuestionControls extends React.Component<QuestionControlsProps, null> {
  static defaultProps: Partial<QuestionControlsProps> = {
    accepted: false,
    archived: false,
  };
  render() {
    return (
      <div className={style.controls}>
      {!this.props.accepted ? 
        <Button className={style.accept} onClick={() => this.handleAccept(true)}>Accept</Button> : null}
      {this.props.accepted ? 
        <Button className={style.reject} onClick={() => this.handleAccept(false)}>Reject</Button> : null}
      {!this.props.archived ? 
          <Button className={style.archive} onClick={() => this.handleArchive(true)}>Archive</Button> : null}
      {this.props.archived ? 
          <Button className={style.unarchive} onClick={() => this.handleArchive(false)}>Unarchive</Button> : null}    
    </div>);
  }

  handleAccept(state: boolean) {
    console.log('handle accept');
    if (this.props.onChangeAcceptedState) {
      this.props.onChangeAcceptedState(state);
    }
  }

  handleArchive(state: boolean) {
    console.log('handle archive');
    if (this.props.onChangeArchivedState) {
      this.props.onChangeArchivedState(state);
    }
  }
}