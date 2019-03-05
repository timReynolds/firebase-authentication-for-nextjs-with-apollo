const express = require("express");
const firebaseAdmin = require("firebase-admin");

const expiresIn = 60 * 60 * 24 * 5 * 1000; // Set session expiration to 5 days.
const cookieSecure = process.env.NODE_ENV === "production";

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("../../../creds/firebase-admin.json")
  )
});

const router = express.Router();

// TODO
// https://firebase.google.com/docs/auth/admin/manage-cookies
router.post("/auth/session/start", (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const token = req.body.token;

  firebase
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => {
      // Only process if the user just signed in in the last 5 minutes.
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
        // Create session cookie and set it.
        res.status(401).send("RECENT SIGN IN REQUIRED");
      }

      return firebase
        .auth()
        .createSessionCookie(token, { expiresIn })
        .then(
          sessionCookie => {
            // Set cookie policy for session cookie.
            const options = {
              maxAge: expiresIn,
              secure: cookieSecure
            };
            res.cookie("token", sessionCookie, {
              maxAge: expiresIn,
              secure: cookieSecure
            });
            res.end(JSON.stringify({ status: "success" }));
          },
          error => {
            console.error(error);
            res.status(401).send("UNAUTHORIZED REQUEST!");
          }
        );
    });
});

// Clear the cookie without
router.post("/auth/session/end", (req, res) => {
  res.clearCookie("token");
  res.json({ status: "success" });
});

module.exports = router;
