import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import Profile from './user/layouts/profile/Profile'

// Redux Store
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history} basename={"/bounty-babe"}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="dashboard" component={Dashboard} />
          <Route path="profile" component={Profile} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
