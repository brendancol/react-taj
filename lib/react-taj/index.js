'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTable = require('react-table');

var _reactTable2 = _interopRequireDefault(_reactTable);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCsv = require('react-csv');

var _index = require('../loading/index');

var _index2 = _interopRequireDefault(_index);

require('./index.css');

var _multiIndexDfHelpers = require('./multi-index-df-helpers.js');

var s2 = _interopRequireWildcard(_multiIndexDfHelpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pagination = false;
var filter = false;

var ReactTaj = function (_Component) {
  _inherits(ReactTaj, _Component);

  function ReactTaj() {
    _classCallCheck(this, ReactTaj);

    var _this = _possibleConstructorReturn(this, (ReactTaj.__proto__ || Object.getPrototypeOf(ReactTaj)).call(this));

    _this.state = {
      tableColumns: {},
      contentData: [],
      headers: [],
      pivot: [],
      error: undefined,
      isFetching: false
    };
    _this.changeTable = _this.changeTable.bind(_this);
    return _this;
  }

  _createClass(ReactTaj, [{
    key: 'changeTable',
    value: function changeTable(url) {
      var _this2 = this;

      var self = this;
      this.setState({ isFetching: true });
      fetch('' + url).then(function (response) {
        return response.json();
      }).then(function (data) {
        var generateCol = s2.generateCol,
            generateData = s2.generateData;

        var newData = generateData(data);
        var cols = generateCol(data);
        self.setState({
          tableColumns: data,
          headers: cols,
          contentData: newData,
          isFetching: false
        });
      }).catch(function (error) {
        _this2.setState({ error: error, isFetching: false });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var url = this.props.url;

      this.changeTable(url);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.url !== nextProps.url) {
        this.changeTable(nextProps.url);
      }
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(e) {
      e.preventDefault();
      this.setState({ url: e.target.url.value });
      var data = {
        url: e.target.url.value
      };
      this.changeTable(JSON.stringify(data));
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          tableColumns = _state.tableColumns,
          headers = _state.headers,
          contentData = _state.contentData,
          error = _state.error,
          isFetching = _state.isFetching,
          pivot = _state.pivot;


      var isPaginate = this.props.pagination || pagination;
      var isFilter = this.props.filter || filter;
      var classNames = this.props.className || 'taj';

      var content = void 0;
      if (contentData.length !== 0) {
        content = _react2.default.createElement(_reactTable2.default, {
          filterable: isFilter,
          data: contentData,
          columns: headers,
          showPagination: isPaginate,
          defaultPageSize: isPaginate ? 20 : 200000,
          minRows: 1 });
      }

      return _react2.default.createElement(
        'div',
        null,
        isFetching && contentData.length === 0 ? _react2.default.createElement(
          'div',
          { className: 'loading' },
          _react2.default.createElement(_index2.default, null)
        ) : _react2.default.createElement(
          'div',
          { className: classNames },
          _react2.default.createElement(
            'div',
            { className: 'react-taj__csv' },
            _react2.default.createElement(
              _reactCsv.CSVLink,
              { data: contentData, className: 'react-taj__download' },
              'Export CSV'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'react-taj' },
            content
          )
        )
      );
    }
  }]);

  return ReactTaj;
}(_react.Component);

ReactTaj.propTypes = {
  url: _propTypes2.default.string,
  pagination: _propTypes2.default.bool,
  filter: _propTypes2.default.bool,
  colors: _propTypes2.default.array,
  className: _propTypes2.default.string
};

exports.default = ReactTaj;