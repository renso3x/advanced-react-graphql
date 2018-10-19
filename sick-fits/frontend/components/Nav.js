import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <NavStyles>
    <Link href="/">
      <a>Shop</a>
    </Link>
    <Link href="/">
      <a>Sell</a>
    </Link>
    <Link href="/">
      <a>Signup</a>
    </Link>
    <Link href="/">
      <a>Orders</a>
    </Link>
    <Link href="/">
      <a>Me</a>
    </Link>
  </NavStyles>
);

export default Nav;