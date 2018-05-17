import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import {CSVLink, CSVDownload} from 'react-csv';
import Loading from '../loading/index';
import './index.css';
import * as s2 from './multi-index-df-helpers.js';

const pagination = false;
const filter = false;
class ReactTaj extends Component {
  constructor() {
    super();
    this.state = {
    tableColumns: {},
    contentData: [],
    headers: [],
    pivot:[],
    error: undefined,
    isFetching: false
  };
  this.changeTable = this.changeTable.bind(this);
}

changeTable(url){
  const self = this;
  this.setState({ isFetching: true });
  fetch(`${url}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
        const { generateCol, generateData } = s2;
        const newData = generateData(data);
        const cols = generateCol(data);
          self.setState({
            tableColumns: data,
            headers:cols,
            contentData:newData,
            isFetching: false
          });
    }).catch(error=>{
      this.setState({ error: error,isFetching: false });
    });

}
componentDidMount() {
  const { url } = this.props;
  this.changeTable(url);
}
componentWillReceiveProps(nextProps) {
   if (this.props.url !== nextProps.url) {
     this.changeTable(nextProps.url);
   }
 }

  onSubmit(e) {
  e.preventDefault();
  this.setState({ url: e.target.url.value });
  const data = {
    url: e.target.url.value
  };
  this.changeTable(JSON.stringify(data));
}

  render() {
    const {
      tableColumns,
      headers,
      contentData,
      error,
      isFetching,
      pivot } = this.state;

    const isPaginate = this.props.pagination || pagination;
    const isFilter = this.props.filter || filter;
    const classNames = this.props.className || 'taj';

    let content;
    if (contentData.length!== 0) {
    content = <ReactTable
      filterable={isFilter}
      data={contentData}
      columns={headers}
      showPagination={isPaginate}
      defaultPageSize= {isPaginate? 20: 200000}
      minRows={1}/>;
    }

    return (
      <div>
        {
          isFetching && (contentData.length===0) ? (
            <div className='loading'>
              <Loading />
            </div>
          ) : (
            <div className= {classNames}>
              <div className='react-taj__csv'>
                <CSVLink data={contentData} className='react-taj__download'>Export CSV</CSVLink>
              </div>
              <div className='react-taj'>
                {content}
              </div>
            </div>
          )}
      </div>
    );
  }
}
ReactTaj.propTypes={
  url: PropTypes.string,
  pagination: PropTypes.bool,
  filter: PropTypes.bool,
  colors: PropTypes.array,
  className: PropTypes.string
};

export default ReactTaj;
