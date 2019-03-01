import firebase from "firebase";
import config from "../../../creds/firebase-client.json";

// Configure Firebase.
export default function init() {
  // Ensure we only initialize the app once
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}
