import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactTaj from '../dist/react-taj';
import './index.css';
const colors = [
  '#762a83',
  '#9970ab',
  '#c2a5cf',
  '#e7d4e8',
  '#f7f7f7',
  '#d9f0d3',
  '#a6dba0',
  '#5aae61',
  '#1b7837'
];

class Example extends Component {
  constructor() {
  super();
  this.state = {
    url: ''
  };
  this.onSubmit = this.onSubmit.bind(this);
}

  onSubmit(e) {
  e.preventDefault();
  this.setState({ url: e.target.url.value });
}

  render() {
    const { url } = this.state;
    return (
      <div>
        <div className='form__select'>
          <form className='url__form' onSubmit={this.onSubmit}>
            <div className='address__form-group'>
              <label htmlFor='url' className='download'>Enter Table URL</label>
              <input
                type='text'
                name='url'
                id='url'
                placeholder='http://localhost:5000/dfmulti'
                className='download url__input'
              />
            </div>
            <button className='download'>Submit</button>
          </form>
        </div>
        <ReactTaj url={url}
          pagination={false}
          filter={false}
          colors={colors}
        />
      </div>
    );
  }
}
Example.propTypes={
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

ReactDOM.render(
<Example />,
  document.getElementById('root')
);
