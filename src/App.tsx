/* tslint:disable no-console */
import 'core-js';
import * as React from 'react';
import {Provider} from 'mobx-react';
const style = require('./App.pcss');
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import QuestionInputPanel from './containers/QuestionInputPanel';
import LoginModal from './containers/LoginModal';
import questionStore from './models/QuestionStore';
import eventStore from './models/EventStore';
import uiStore from './models/UiStore';
import apiStore from './models/ApiStore';
const App = () => {
  return (
    <Provider apiStore={apiStore} questionStore={questionStore} uiStore={uiStore} eventStore={eventStore}>
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

export default App;
