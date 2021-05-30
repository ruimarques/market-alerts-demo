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
import AlertsPage from './pages/Alerts';

function App() {
  return (
    <div className={styles.container}>
      <Router>
        <h1 className="title">Stock Viewer</h1>
        <nav className={styles.navigation}>
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
            <AlertsPage />
          </Route>
          <Redirect from={`/`} to={`/stocks`} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
