import * as React from 'react';
import {inject} from 'mobx-react';
import {UiStore} from '../../models/UiStore';
interface Props {
  uiStore?: UiStore;
  active: boolean;
  children?: React.ReactElement<any>; // tslint:disable-line
  close: () => void;
}
// TODO: write down a state machine to ensure this works correctly

@inject('uiStore')
export default class EscapeToClose extends React.Component<Props, {}> {
  render() {
    return React.Children.only(this.props.children);
  }
}
