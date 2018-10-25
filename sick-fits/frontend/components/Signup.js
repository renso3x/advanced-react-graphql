import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup (
      name: $name
      email: $email
      password: $password
    ) {
      name
      email 
      password
    }
  }
`

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  }

  saveState = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {
          (signup, { error, loading }) => {
            return (
              <Form
                method="post"
                onSubmit={async (e) => {
                  e.preventDefault();
                  console.log(this.state)
                  const res = await signup();
                  console.log(res);
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Signp up for An Account</h2>
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
                  <label htmlFor="name">
                    Name
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="name"
                      required
                      value={this.state.name}
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
                  <button type="submit">Signup</button>
                </fieldset>
              </Form>
            )
          }
        }
      </Mutation>
    )
  }
}

export default Signup;