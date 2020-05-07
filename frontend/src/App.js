import React from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/auth';
import EventsPage from './pages/events';
import BookingsPage from './pages/bookings';

import MainNavigation from './components/navigation/main-nav';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
