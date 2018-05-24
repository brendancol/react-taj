import React, { Component } from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import Loading from '../loading/index';
import './index.css';
import * as s2 from './multi-index-df-helpers.js';

const pagination = false;
const filter = false;
const exportable = false;

class ReactTaj extends Component {
    constructor() {
        super();
        this.state = {
            tableColumns: {},
            contentData: [],
            headers: [],
            filteredData: [],
            pivot: [],
            useBackgroundColors: false,
            useForegroundColors: false,
            error: undefined,
            isFetching: false
        };
        this.changeTable = this.changeTable.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    changeTable (url){
        const self = this;
        this.setState({ isFetching: true });
        fetch(`${url}`,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                const { generateCol, generateData } = s2;
                const newData = generateData(data);
                const cols = generateCol(data);
                self.setState({
                    tableColumns: data,
                    headers: cols,
                    filteredData: newData,
                    contentData: newData,
                    error: undefined,
                    isFetching: false
                });
            }).catch(error => {
                this.setState({
                    error,
                    isFetching: false,
                    tableColumns: {},
                    filteredData: [],
                    contentData: [],
                    headers: [] });
            });

    }
    componentDidMount() {
        const { url } = this.props;
        this.changeTable(url);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.url !== nextProps.url)
            this.changeTable(nextProps.url);
    }
    handleSearch(e) {
        const {
            tableColumns,
            contentData } = this.state;
        let { filterFields } = tableColumns.meta;
        if (filterFields) {
            filterFields = filterFields.reduce((acc,field) => {
                acc[field] = field;

                return acc;
            },{});
            const newContentData = contentData.filter(field => {
                return Object.keys(field).reduce((acc, column) => {
                    if (filterFields[column] && String(field[column]).startsWith(e.target.value))
                        return true;

                    return acc;
                },false);
            });
            this.setState(() => ({ filteredData: newContentData }));
        }
    }

    onSubmit (e){
        e.preventDefault();
        this.setState({ url: e.target.url.value });
        const data = {
            url: e.target.url.value
        };
        this.changeTable(JSON.stringify(data));
    }

    render() {
        const {
            headers,
            filteredData,
            tableColumns,
            error,
            isFetching } = this.state;
        const { useBackgroundColors, useForegroundColors } = this.props;
        const isPaginate = this.props.pagination || pagination;
        const isFilter = this.props.searchable || filter;
        const exportablle = this.props.exportable || exportable;
        const classNames = this.props.className || 'taj';
        let content;
        if (filteredData.length!== 0) {
            content = <ReactTable
                data={filteredData}
                columns={headers}
                useBackgroundColors={useBackgroundColors}
                useForegroundColors={useForegroundColors}
                showPagination={isPaginate}
                defaultPageSize= {isPaginate? 20: 200000}
                minRows={1}/>;
        } else {
            content = <h3> no result found </h3>;
        }
        let filterFields = [];
        if (tableColumns && tableColumns.meta) {
            filterFields = tableColumns.meta.filterFields;
        }

        return (
            <div>
                {error ? (<h1 className='error_message'>Error Entered URL</h1>):<div></div>}
                {
                    isFetching && (filteredData.length===0) ? (
                        <div className='loading'>
                            <Loading />
                        </div>
                    ) : (
                        <div className= {classNames}>
                            <div className='react-taj__controllers'>
                                {
                                    exportablle? (
                                        <div className='react-taj__csv'>
                                            <CSVLink
                                                data={filteredData} className='react-taj__download'>Export CSV</CSVLink>
                                        </div>
                                    ): <div></div>
                                }
                                {
                                    (isFilter && filterFields) ? (
                                        <div>
                                            <label>Filtered Columns: {filterFields.join(' & ')} </label>
                                            <input className='react-taj__search'
                                                type='search' placeholder='search here..' onChange={this.handleSearch} />
                                        </div>
                                    ): <div></div>
                                }
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
    searchable: PropTypes.bool,
    useBackgroundColors: PropTypes.bool,
    useForegroundColors: PropTypes.bool,
    exportable: PropTypes.bool,
    colors: PropTypes.array,
    className: PropTypes.string
};

export default ReactTaj;
