import React from "react";
import Head from "../src/components/head";
import Nav from "../src/components/nav";

import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_BOOKS = gql`
  {
    books {
      title
    }
    user {
      id
      email
    }
  }
`;

const Home = () => (
  <div>
    <Head title="Home" />
    <Nav />

    <Query query={GET_BOOKS}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const email = data.user ? data.user.email : "New User";

        return (
          <div className="hero">
            <h1 className="title">Welcome {email}!</h1>
            <ul>
              {data.books.map(book => (
                <li key={book.title}>{book.title}</li>
              ))}
            </ul>
          </div>
        );
      }}
    </Query>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
);

export default Home;
