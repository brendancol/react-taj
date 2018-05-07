import React, { Component } from 'react';

import './index.css';

class Loading extends Component {
  render() {

    return (
      <div className='loading__container'>
        <div className='loading' ></div>
      </div>
    );
  }
}

export default (Loading);
