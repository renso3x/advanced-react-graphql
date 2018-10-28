import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      name 
      email
    }
  }
`;

const User = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
);

User.propsTypes = {
  children: PropTypes.func.isRequired
};

export default User;

export { CURRENT_USER_QUERY };