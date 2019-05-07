const express = require("express");
const cookieParser = require("cookie-parser");

const { ApolloServer, gql } = require("apollo-server-express");
const firebaseAdmin = require("firebase-admin");

const app = express();
const port = parseInt(process.env.PORT, 10) || 4000;

// Init firebase admin
const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("../creds/firebase-admin.json")
  )
});

// Taken from the getting started guide
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type User {
    id: String
    email: String
  }

  type Query {
    books: [Book]
    user: User
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    user: (_o, _a, context) => context.user
  }
};

// https://www.apollographql.com/docs/apollo-server/features/authentication.html
const context = async ({ req }) => {
  // Take the cookies sessions token that was populated via the firebase admin sdk
  const token = req.headers.authorization
    ? req.headers.authorization.substring(7)
    : "";
  try {
    // verify token including revocation check
    // if it fails in anyway set context of user to null
    const claims = await firebase.auth().verifySessionCookie(token, true);

    return { user: { id: claims.user_id, email: claims.email } };
  } catch (err) {
    return { user: null };
  }
};

const server = new ApolloServer({ typeDefs, resolvers, context });

// Express
app.use(cookieParser());

// https://www.apollographql.com/docs/apollo-server/essentials/server.html#integrations
server.applyMiddleware({
  app,
  path: "/",
  cors: {
    origin: /localhost:3000$/,
    credentials: true
  }
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
