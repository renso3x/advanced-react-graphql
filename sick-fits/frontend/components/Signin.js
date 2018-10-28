import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin (email: $email password: $password) {
      id
      email
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  }

  saveState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {
          (signin, { error, loading }) => {
            return (
              <Form
                method="post"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await signin();
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Signin Into your Account</h2>
                  <label htmlFor="email">
                    Email
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email"
                      required
                      value={this.state.email}
                      onChange={this.saveState}
                    />
                  </label>
                  <label htmlFor="password">
                    Password
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="password"
                      required
                      value={this.state.password}
                      onChange={this.saveState}
                    />
                  </label>
                  <button type="submit">Signin</button>
                </fieldset>
              </Form>
            )
          }
        }
      </Mutation>
    )
  }
}

export default Signin;