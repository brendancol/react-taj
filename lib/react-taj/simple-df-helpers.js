'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getColor = function getColor(value, maxMin, colors) {
  if (maxMin && maxMin['max']) {
    var max = maxMin.max,
        min = maxMin.min;

    return colors[Math.floor((value - min) / (max - min) * (colors.length - 1))];
  }
  return null;
};
var generateCol = exports.generateCol = function generateCol(data, maxMin, colors) {
  maxMin = [{}].concat(_toConsumableArray(maxMin));
  return data.schema.fields.map(function (key, i) {
    return {
      Header: key.name,
      accessor: key.name,
      getProps: function getProps(state, rowInfo, column) {
        if (rowInfo) return {
          style: {
            background: getColor(rowInfo.row[key.name], maxMin[i], colors)
          }
        };
        return {};
      }
    };
  });
};
var getMaxMinVals = function getMaxMinVals(data) {
  return Object.values(data).map(function (col, i) {
    var res = Object.values(col);
    if (typeof res[0] === "number") return {
      max: Math.max.apply(Math, _toConsumableArray(res)),
      min: Math.min.apply(Math, _toConsumableArray(res))
    };
    return {};
  });
};
var generateData = exports.generateData = function generateData(data) {
  var dataRow = data.data;
  var keys = Object.keys(dataRow);
  var result = void 0;
  result = Object.keys(dataRow[keys[0]]).map(function (el, i) {
    return keys.reduce(function (acc, cur) {
      acc['index'] = i;
      acc[cur] = dataRow[cur][i];

      return acc;
    }, {});
  });
  return {
    newData: result,
    maxMin: getMaxMinVals(dataRow)
  };
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