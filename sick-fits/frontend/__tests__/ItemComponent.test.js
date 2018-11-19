import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';

const fakeItem = {
  id: 1,
  title: 'A cool hat',
  image: 'cat.jpg',
  largeImage: 'cat_large.jpg',
  price: '50000'
}

describe('<Item />', () => {

  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const image = wrapper.find('img');
    expect(image.props().src).toBe(fakeItem.image);
    expect(image.props().alt).toBe(fakeItem.title);
  });

  it('renders the button properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList').children();
    expect(buttonList).toHaveLength(3);
    expect(buttonList.find('Link')).toBeTruthy();
    expect(buttonList.find('AddCart')).toBeTruthy();
    expect(buttonList.find('DeleteItem')).toBeTruthy();
  });

  it('renders the title and price properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const title = wrapper.find('Title a').text();
    expect(title).toBe(fakeItem.title);

    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$500');
  })

})