import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";

import redirect from "../../src/redirect";
import checkLoggedIn from "../../src/auth/checkLoggedIn";
import clearAuthDataCache from "../../src/auth/clearAuthDataCache";

import Head from "../../src/components/head";
import Nav from "../../src/components/nav";

import firebaseInit from "../../src/firebase-client/init";

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "redirect",
  credentialHelper: "googleyolo",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: "",
  privacyPolicyUrl: "",
  callbacks: {
    // Avoid redirects after sign-in.
    // https://github.com/firebase/firebaseui-web#available-callbacks
    // This can't return a promise or anything other than boolean
    // so don't try to use it for the session creation
    signInSuccessWithAuthResult: () => false
  }
};
firebaseInit();

class Login extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { apolloClient } = this.props;

    // If the user is already signed, they don't need to be here
    const { loggedInUser } = await checkLoggedIn(apolloClient);
    if (loggedInUser.user) {
      redirect(context, "/");
    }

    // Firebase
    firebaseInit();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return user
          .getIdToken()
          .then(token => {
            return fetch("/api/auth/session/start", {
              method: "POST",
              headers: new Headers({ "Content-Type": "application/json" }),
              credentials: "same-origin",
              body: JSON.stringify({ token })
            });
          })
          .then(() => firebase.auth().signOut())
          .then(() => clearAuthDataCache(apolloClient))
          .then(() => Router.push("/"));
      }
    });
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <>
        <Head title="Home" />
        <Nav />
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </>
    );
  }
}

export default class LoginPage extends Component {
  render() {
    return (
      <ApolloConsumer>
        {client => <Login apolloClient={client} />}
      </ApolloConsumer>
    );
  }
}
