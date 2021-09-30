import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import './App.scss';
import { Viewer } from './Viewer/Viewer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/test" exact render={() => <h1>OK home</h1>}/>
        <Route path="/" component={Viewer}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
