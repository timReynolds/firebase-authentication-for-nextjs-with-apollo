# Firebase Authentication example for Next.JS (SSR React) with Apollo

Unlike traditional frameworks that provide a server-side templating engine to create HTML which can then be shipped to the client (browser), SPA which are server-side rendered require the ability to authenticate the user against the API on both the client and the server.

Next.JS already provides many examples of various authentication setups, however, if you're trying to follow along using an external authentication provider, like firebase, along with Apollo server you'd have to follow serval examples without extensive explanation.

This repository builds on those to provide a more comprehensive example referencing the relevant documentation to help you understand what's required to create an application using these technologies which includes authentication.

## Running the example

To run the example, you'll need both client and admin credentials retrieved from your [firebase accounts](https://firebase.google.com) console.

Client credentials are required to run the [firebase web ui](https://github.com/firebase/firebaseui-web) and can be retrieved using the Web setup button in the Authentication screen in the Firebase console. These should be placed in `creds/firebase-client.json`.

```json
{
  "apiKey": "",
  "authDomain": ""
}
```

Admin credentials are required to initialise the firebase admin SDK used on the server to create cookies and verify them. These are retrieved using the Service accounts tab in the Settings screen of the Firebase console. These should be placed in `creds/firebase-admin.json`.

```json
{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}
```

Both the server and the client can then run using `npm run dev` in both the server and client folder which will run the UI on [http://localhost:3000](http://localhost:3000)

## Explanation
