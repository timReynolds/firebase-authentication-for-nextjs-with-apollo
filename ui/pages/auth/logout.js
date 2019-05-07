import React, { Component } from "react";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";

import clearAuthDataCache from "../../src/auth/clearAuthDataCache";

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { apolloClient } = this.props;

    return fetch("/api/auth/session/end", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin"
    })
      .then(() => clearAuthDataCache(apolloClient))
      .then(() => Router.push("/"));
  }

  render() {
    return <>logout</>;
  }
}

export default class LogoutPage extends Component {
  render() {
    return (
      <ApolloConsumer>
        {client => <Logout apolloClient={client} />}
      </ApolloConsumer>
    );
  }
}
