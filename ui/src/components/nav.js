import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_USER = gql`
  {
    user {
      id
    }
  }
`;

const Nav = () => (
  <Query query={GET_USER}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <nav>
          <ul>
            <li>
              <Link prefetch href="/">
                <a>Home</a>
              </Link>
            </li>
            <ul>
              {!data.user && (
                <li key="login">
                  <Link href="/auth/login">
                    <a>Login</a>
                  </Link>
                </li>
              )}
              {data.user && (
                <li key="logout">
                  <Link href="/auth/logout">
                    <a>Logout</a>
                  </Link>
                </li>
              )}
            </ul>
          </ul>
          <style jsx>{`
            :global(body) {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Avenir Next,
                Avenir, Helvetica, sans-serif;
            }
            nav {
              text-align: center;
            }
            ul {
              display: flex;
              justify-content: space-between;
            }
            nav > ul {
              padding: 4px 16px;
            }
            li {
              display: flex;
              padding: 6px 8px;
            }
            a {
              color: #067df7;
              text-decoration: none;
              font-size: 13px;
            }
          `}</style>
        </nav>
      );
    }}
  </Query>
);

export default Nav;
