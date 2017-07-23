/* tslint:disable no-console */
import * as React from 'react';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import {QuestionStore} from './models/Store';
import './App.css';

export const questionStore = new QuestionStore();

const App = () => {
  return (
      <div className="app">
        <Sidebar/>
        <Main/>
      </div>
  );
};

export default App;
