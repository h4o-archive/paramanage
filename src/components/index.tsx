import React from "react";
import { Router, Route } from "react-router";
import { history } from "utils/history";

import { Dashboard } from "./Dashboard"
import { Profile } from "./Profile"
import { Loader } from "components/Common/Loader"

export const App: React.FunctionComponent = () => {
  return (
    <Router history={history}>
      <Loader />
      <Route path="/" exact component={Dashboard} />
      <Route path="/profile/:id" component={Profile} />
    </Router>
  )
}