import React from 'react';
import Head from './Head';
import Meta from './Meta';

class Page extends React.Component {
  render() {
    return (
      <div>
        <Meta />
        <Head />
        {this.props.children}
      </div>
    );
  }
}

export default Page;