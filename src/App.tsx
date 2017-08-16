/* tslint:disable no-console */
import 'core-js';
import * as React from 'react';
import {Provider} from 'mobx-react';
const style = require('./App.pcss');
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import QuestionInputPanel from './containers/QuestionInputPanel';
import LoginModal from './containers/LoginModal';
import QuestionStore from './services/QuestionStore';
import EventStore from './services/EventStore';
import ApiStore from './services/ApiStore';
import UiStore from './services/UiStore';
class App extends React.Component<null, null> {
  private apiStore: ApiStore;
  private uiStore: UiStore;
  private eventStore: EventStore;
  private questionStore: QuestionStore;
  constructor(props: null) {
    super(props);

  }

  componentWillMount() {
    this.apiStore = new ApiStore();
    this.uiStore = new UiStore();
    // dependency injection!
    this.eventStore = new EventStore(this.apiStore);
    this.questionStore = new QuestionStore(this.apiStore);
  }

  render() {
    return (
    <Provider 
      apiStore={this.apiStore} 
      questionStore={this.questionStore} 
      uiStore={this.uiStore} 
      eventStore={this.eventStore}>
      <div className={style.app} id="app">
        <Sidebar/>
        <Main/>
        <QuestionInputPanel/>
        <div className={style.modals} id="modals">
          <LoginModal />
        </div>
      </div>
    </Provider>
  );
};
}

export default App;
