import * as React from 'react';
import {Provider} from 'mobx-react';
const style = require('./App.pcss');
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import QuestionInputPanel from './containers/QuestionInputPanel';
import LoginModal from './containers/LoginModal';
import AboutModal from './containers/AboutModal';
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

  // Makes sure that the stores are created only during mounting, i.e. on client
  componentWillMount() {
    this.apiStore = new ApiStore();
    this.uiStore = new UiStore();
    (window as any).uiStore = this.uiStore; // tslint:disable-line
    // dependency injection
    this.eventStore = new EventStore(this.apiStore);
    this.questionStore = new QuestionStore(this.apiStore, this.eventStore, this.uiStore);
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
          <LoginModal/>
          <AboutModal/>
        </div>
      </div>
    </Provider>
  );
};
}

export default App;
