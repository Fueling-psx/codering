import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,IndexRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import print from './components/print/printting';


ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="print" component={print} />
      <Route path="Home" component={Home} />
    </Route>
  </Router>
), document.getElementById('con'));