"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var generateCol = exports.generateCol = function generateCol(data) {
  var keys = Object.keys(data);
  return keys.map(function (key) {
    if (Array.isArray(data[key])) return {
      Header: key,
      accessor: key,
      id: key
    };else return {
      Header: key,
      columns: generateCol(data[key])
    };
  });
};
var getRow = function getRow(data, i) {
  var keys = Object.keys(data);
  var acc = {};
  keys.every(function (key) {
    if (Array.isArray(data[key])) {
      if (i < data[key].length) acc[key] = data[key][i];else return acc = undefined;
    } else {
      var newKey = getRow(data[key], i);
      if (!newKey) return acc = newKey;
      acc = _extends({}, acc, newKey);
    }
    return true;
  });
  return acc;
};
var generateData = exports.generateData = function generateData(data) {
  var result = [];
  var i = 0;
  var row = getRow(data, i++);
  while (row) {
    result.push(row);
    row = getRow(data, i++);
  }
  return result;
};
var sortKeys = function sortKeys(data) {
  var sortable = [];
  for (var key in data) {
    sortable.push([key, data[key]]);
  }
  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });
  return sortable;
};
var findPivot = exports.findPivot = function findPivot(data) {
  var tempData = {};
  var keys = [];
  var repeated = data.reduce(function (acc, el, i) {
    keys = Object.keys(el);
    if (i === 0) {
      // initialize all values to 0
      acc = keys.reduce(function (acc2, el2) {
        tempData[el2] = [];
        acc2[el2] = 0;
        return acc2;
      }, {});
    }
    return keys.reduce(function (acc2, key) {
      if (tempData[key].indexOf(el[key]) > -1) ++acc[key];
      tempData[key].push(el[key]);
      return acc;
    }, acc);
  }, {});
  var resultArray = sortKeys(repeated);
  var length = resultArray.length;
  return [resultArray[length - 1][0], resultArray[length - 2][0]]; // take the highest two
};