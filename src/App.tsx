import {
  Switch,
  Route,
  Redirect,
  NavLink,
  BrowserRouter as Router,
} from 'react-router-dom';

import 'bulma/css/bulma.min.css';
import styles from './App.module.css';

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <h1 className="title">Stock Viewer</h1>
      <nav>
        <NavLink className="button is-small" to={`/stocks`}>
          Stocks
        </NavLink>
        <NavLink className="button is-small" to={`/alerts`}>
          Alerts
        </NavLink>
      </nav>

      <Switch>
        <Route path="/stocks">
          <Dashboard />
        </Route>
        <Route path="/alerts">
          <h2 className="subtitle">Alerts</h2>
        </Route>
        <Redirect from={`/`} to={`/stocks`} />
      </Switch>
    </Router>
  );
}

export default App;
