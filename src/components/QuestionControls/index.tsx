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
    const {accepted, archived} = this.props;
    return (
      <div className={style.container}>
        <Button 
          title={accepted ? 'Accepted' : 'Rejected'}
          className={accepted ? style.accept : style.reject} 
          onClick={() => this.handleAccept(!accepted)}/>
        <Button 
          title={archived ? 'Unarchive' : 'Archive'}
          className={archived ? style.unarchive : style.archive} 
          onClick={() => this.handleArchive(!archived)}/>
    </div>);
  }

  handleAccept(state: boolean) {
    if (this.props.onChangeAcceptedState) {
      this.props.onChangeAcceptedState(state);
    }
  }

  handleArchive(state: boolean) {
    if (this.props.onChangeArchivedState) {
      this.props.onChangeArchivedState(state);
    }
  }
}