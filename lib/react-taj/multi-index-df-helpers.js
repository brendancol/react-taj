'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getStyle = function getStyle(data, value, access, taj) {
    var _taj$props = taj.props,
        useForegroundColors = _taj$props.useForegroundColors,
        useBackgroundColors = _taj$props.useBackgroundColors;

    if (data.meta.columns.bins && data.meta.columns.bins[access] && value) {
        var newStyle = { background: '', color: '' };
        var colors = data.meta.columns.bins[access].colors;

        data.meta.columns.bins[access].edges.every(function (edge, i) {
            if (value >= edge && colors.bg[i]) {
                var _background = useBackgroundColors ? colors.bg[i] : '';
                var _color = useForegroundColors ? colors.fg[i] : '';
                newStyle = { background: _background, color: _color };

                return true;
            }

            return false;
        });

        return newStyle;
    }

    var _data$meta$colors = data.meta.colors,
        bg = _data$meta$colors.bg,
        fg = _data$meta$colors.fg; // default colors

    var background = useBackgroundColors ? bg : '';
    var color = useForegroundColors ? fg : '';

    return {
        background: background,
        color: color
    };
};

var generateIndexHeader = function generateIndexHeader(data) {
    if (Array.isArray(data.meta.index.name)) // if super
        return data.meta.index.name.map(function (name) {
            return {
                Header: '', // change this to name to add index header to the first row
                accessor: name,
                id: name,
                getProps: function getProps(state, rowInfo, column, taj) {
                    return {
                        style: getStyle(data, rowInfo.row[column.id], column.id, taj)
                    };
                }
            };
        });

    return [{
        Header: '',
        accessor: 'index0',
        getProps: function getProps(state, rowInfo, column, taj) {
            return {
                style: getStyle(data, rowInfo.row[column.id], column.id, taj)
            };
        }
    }];
};

var generateIndexField = exports.generateIndexField = function generateIndexField(data) {
    var obj = {};
    if (Array.isArray(data.meta.index.name)) // if super
        return data.meta.index.name.map(function (item) {
            obj[item] = item;

            return obj;
        });

    return [{ index0: data.meta.index.name }];
};
var generateCol = exports.generateCol = function generateCol(data) {

    var temp = {};
    var indexHeader = generateIndexHeader(data);
    if (Array.isArray(data.columns[0])) // not simple json
        return data.columns.reduce(function (acc, column) {
            if (temp[column[0]] !== undefined) acc[temp[column[0]]].columns.push({
                Header: column[1],
                accessor: column.join('|'),
                getProps: function getProps(state, rowInfo, column, taj) {
                    return {
                        style: getStyle(data, rowInfo.row[column.id], column.id, taj)
                    };
                }
            });else {
                if (column.length === 1) acc.push({
                    Header: column[0],
                    accessor: column[0],
                    getProps: function getProps(state, rowInfo, column, taj) {
                        return {
                            style: getStyle(data, rowInfo.row[column.id], column.id, taj)
                        };
                    }
                });else acc.push({
                    Header: column[0],
                    columns: [{
                        Header: column[1],
                        accessor: column.join('|'),
                        getProps: function getProps(state, rowInfo, column, taj) {
                            return {
                                style: getStyle(data, rowInfo.row[column.id], column.id, taj)
                            };
                        }
                    }]
                });
                temp[column[0]] = acc.length - 1;
            }

            return acc;
        }, indexHeader);
    // if table is simple
    var newCols = data.columns.map(function (column) {
        return {
            Header: column,
            accessor: column,
            id: column,
            getProps: function getProps(state, rowInfo, column, taj) {
                return {
                    style: getStyle(data, rowInfo.row[column.id], column.id, taj)
                };
            }
        };
    });

    return [{
        Header: 'Index',
        accessor: 'index0',
        id: 'index0',
        getProps: function getProps(state, rowInfo, column, taj) {
            return {
                style: getStyle(data, rowInfo.row[column.id], column.id, taj)
            };
        }
    }].concat(_toConsumableArray(newCols));
};
var generateData = exports.generateData = function generateData(data) {
    var indexCols = void 0;
    var content = data.data.map(function (el, index) {
        if (Array.isArray(data.meta.index.name)) // if super
            indexCols = data.meta.index.name.reduce(function (acc, indexName, i) {
                acc[indexName] = data.index[index][i];

                return acc;
            }, {});else indexCols = { index0: data.index[index] };

        return el.reduce(function (acc, cell, i) {
            if (Array.isArray(data.columns[i])) // not simple json
                acc[data.columns[i].join('|')] = cell;else acc[data.columns[i]] = cell;

            return acc;
        }, indexCols);
    });
    if (!data.meta.index.name) // simple
        return content;
    var indexField = generateIndexField(data); // index header row

    return [indexField[0]].concat(_toConsumableArray(content));
};