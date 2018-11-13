import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {me && (
          <>
            <Link href="/">
              <a>Shop</a>
            </Link>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/">
              <a>Orders</a>
            </Link>
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {(toggleCart) => (
                <>
                  <button onClick={toggleCart}>My Cart
                    <CartCount count={me.cart.reduce((tally, cartCount) => tally + cartCount.quantity, 0)} />
                  </button>
                </>
              )}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Singin</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;