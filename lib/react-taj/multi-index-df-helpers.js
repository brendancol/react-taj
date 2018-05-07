'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getColor = function getColor(value, maxMin, colors) {
    var max = maxMin.max,
        min = maxMin.min;

    return colors[Math.floor((value - min) / (max - min) * (colors.length - 1))];
};

var generateIndexHeader = function generateIndexHeader(data) {
    if (Array.isArray(data.index_field)) {
        return data.index_field.map(function (item, i) {
            return { Header: '', accessor: 'index' + i };
        });
    } else {
        return [{ Header: '', accessor: 'index0' }];
    }
};

var generateIndexField = exports.generateIndexField = function generateIndexField(data) {
    var obj = {};
    if (Array.isArray(data.index_field)) {
        return data.index_field.map(function (item, i) {
            obj['index' + i] = item;
            return obj;
        });
    } else {
        return [{ index0: data.index_field }];
    }
};
var generateCol = exports.generateCol = function generateCol(data, maxMin, colors) {
    var temp = {};
    var indexHeader = generateIndexHeader(data);
    return data.columns.reduce(function (acc, column, i) {
        if (temp[column[0]] !== undefined) {
            var access = column.join();
            acc[temp[column[0]]].columns.push({
                Header: column[1],
                accessor: column.join(),
                getProps: function getProps(state, rowInfo, column) {
                    return {
                        style: {
                            background: getColor(rowInfo.row[access], maxMin[i], colors)
                        }
                    };
                }
            });
        } else {
            if (column.length === 1) acc.push({
                Header: column[0],
                accessor: column[0],
                getProps: function getProps(state, rowInfo, column) {
                    return {
                        style: {
                            background: getColor(rowInfo.row[column[0]], maxMin[i], colors)
                        }
                    };
                }
            });else {
                var _access = column.join();
                acc.push({
                    Header: column[0],
                    columns: [{
                        Header: column[1],
                        accessor: column.join(),
                        getProps: function getProps(state, rowInfo, column) {
                            return {
                                style: {
                                    background: getColor(rowInfo.row[_access], maxMin[i], colors)
                                }
                            };
                        }
                    }]
                });
            }
            temp[column[0]] = acc.length - 1;
        }
        return acc;
    }, indexHeader);
};
var getMaxMinVals = function getMaxMinVals(data) {
    return Array(data[0].length).fill({}).map(function (col, i) {
        var res = data.map(function (cell) {
            return cell[i];
        });
        return {
            max: Math.max.apply(Math, _toConsumableArray(res)),
            min: Math.min.apply(Math, _toConsumableArray(res))
        };
    });
};
var generateData = exports.generateData = function generateData(data) {
    var indexField = generateIndexField(data);
    var content = void 0;
    if (Array.isArray(data.index_field)) {
        content = data.data.map(function (el, index) {
            if (index > 0 && data.index[index][0] === data.index[index - 1][0]) {
                return el.reduce(function (acc, cell, i) {
                    var key = data.columns[i].join();
                    acc[key] = cell;
                    return acc;
                }, { index1: data.index[index][1] });
            } else {
                return el.reduce(function (acc, cell, i) {
                    var key = data.columns[i].join();
                    acc[key] = cell;
                    return acc;
                }, { index0: data.index[index][0], index1: data.index[index][1] });
            }
        });
    } else {
        content = data.data.map(function (el, index) {
            return el.reduce(function (acc, cell, i) {
                var key = data.columns[i].join();
                acc[key] = cell;
                return acc;
            }, { index0: data.index[index] });
        });
    }
    return {
        newData: [indexField[0]].concat(_toConsumableArray(content)),
        maxMin: getMaxMinVals(data.data)

    };
};