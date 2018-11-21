import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_MUTATION = gql`
  mutation REQUEST_MUTATION($email: String!) {
    requestReset (email: $email) {
      message
    }
  }
`;

class Reset extends Component {
  state = {
    email: '',
  }

  saveState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation
        mutation={REQUEST_MUTATION}
        variables={this.state}
      >
        {
          (requestReset, { error, loading, called }) => {
            return (
              <Form
                method="post"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await requestReset();
                  this.setState({ email: '' });
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Request Reset password</h2>
                  {!error && !loading && called && <p>Please check your email!</p>}
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
                  <button type="submit">Reset!</button>
                </fieldset>
              </Form>
            )
          }
        }
      </Mutation>
    )
  }
}

export default Reset;
export { REQUEST_MUTATION }