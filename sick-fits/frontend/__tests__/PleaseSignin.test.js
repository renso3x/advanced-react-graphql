import { mount } from 'enzyme';
import wait from 'waait';
import PleaseSignin from '../components/PleaseSignin';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: null
      }
    }
  }
];

const signedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: fakeUser()
      }
    }
  }
];

describe('<PleaseSignIn />', () => {
  it('renders the sign in dialog to logged out users', () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignin />
      </MockedProvider>
    );

    const loadingText = wrapper.find('p');
    expect(loadingText.text()).toContain('Loading...');
    const SignIn = wrapper.find('PleaseSignin');
    expect(SignIn.exists()).toBe(true);
  })

  it('renders the child component when the user is singed in', async () => {
    const Hey = () => <p>Hey!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin><Hey /></PleaseSignin>
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(wrapper.find('Hey').exists()).toBe(true);
  })
})
