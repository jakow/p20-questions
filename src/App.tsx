/* tslint:disable no-console */
import * as React from 'react';
import {Provider} from 'mobx-react';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import LoginModal from './containers/LoginModal';
import questionStore from './models/QuestionStore';
import uiStore from './models/UiStore';
const style = require('./App.pcss');

const App = () => {
  return (
    <Provider questionStore={questionStore} uiStore={uiStore}>
      <div>
        <div className={style.app} id="app">
          <Sidebar/>
          <Main/>
        </div>
        <div id="modals">
          <LoginModal/>
        </div>
      </div>
    </Provider>
  );
};

export default App;
