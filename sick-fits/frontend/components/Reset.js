import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword (resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
    }
  }
`;

class RequestReset extends Component {
  static PropTypes = {
    resetToken: PropTypes.string.isRequired
  }

  state = {
    password: '',
    confirmPassword: ''
  }

  saveState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {
          (resetPassword, { error, loading, called }) => {
            return (
              <Form
                method="post"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await resetPassword();
                  this.setState({ password: '', confirmPassword: '' });
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Request Reset password</h2>
                  {!error && !loading && called && <p>You have succesfully changed password!</p>}
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
                  <label htmlFor="confirmPassword">
                    Confirm Password
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="confirmPassword"
                      required
                      value={this.state.confirmPassword}
                      onChange={this.saveState}
                    />
                  </label>
                  <button type="submit">Changed Password</button>
                </fieldset>
              </Form>
            )
          }
        }
      </Mutation>
    )
  }
}

export default RequestReset;