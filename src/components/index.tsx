import React from "react";
import { Router, Route } from "react-router";
import { history } from "utils/history";

import { Dashboard } from "./Dashboard"
import { Profile } from "./Profile"


export class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Route path="/" exact component={Dashboard} />
        <Route path="/profile/:id" component={Profile} />
      </Router>
    );
  }
}