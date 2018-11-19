import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('renders', () => {
    shallow(<CartCount count={10} />);
  });

  it('create snapshot', () => {
    const wrapper = shallow(<CartCount count={20} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates the props', () => {
    const wrapper = shallow(<CartCount count={20} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 1 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
})