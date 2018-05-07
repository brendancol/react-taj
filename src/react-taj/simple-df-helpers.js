const getColor = (value, maxMin, colors) => {
  if (maxMin && maxMin['max']) {
    const {max, min} = maxMin;
    return colors[Math.floor(((value-min)/(max-min))*(colors.length -1))];
  }
  return null;
}
export const generateCol = (data, maxMin, colors) =>{
  maxMin = [{}, ...maxMin];
  return data.schema.fields.map((key, i) => {
    return {
      Header: key.name,
      accessor: key.name,
      getProps: (state, rowInfo, column) => {
        if(rowInfo)
          return {
            style: {
              background: getColor(rowInfo.row[key.name], maxMin[i], colors)
            }
          };
        return {}
      }
    };
  });
}
const getMaxMinVals = data => {
  return Object.values(data).map((col, i) => {
    const res = Object.values(col);
    if (typeof res[0] === "number")
      return {
          max: Math.max(...res),
          min: Math.min(...res)
      }
    return {};
  });
}
export const generateData = data =>{
  const dataRow = data.data;
  const keys= Object.keys(dataRow);
  let result;
  result = Object.keys(dataRow[keys[0]]).map((el,i) => {
     return keys.reduce((acc, cur) => {
          acc['index'] = i;
          acc[cur] = dataRow[cur][i];

          return acc;
        },{});
      });
  return {
    newData: result,
    maxMin: getMaxMinVals(dataRow)
  }
}
const sortKeys = (data) => {
  let sortable = [];
  for (var key in data) {
      sortable.push([key, data[key]]);
  }
  sortable.sort(function(a, b) {
      return a[1] - b[1];
  });
  return sortable;
}
export const findPivot = (data)=>{
  const tempData = {};
  let keys = [];
  const repeated= data.reduce((acc, el, i) => {
    keys = Object.keys(el);
    if (i === 0) { // initialize all values to 0
      acc= keys.reduce((acc2, el2) => {
        tempData[el2] = [];
        acc2[el2] = 0;
        return acc2;
      },{});
    }
    return keys.reduce((acc2, key) => {
      if(tempData[key].indexOf(el[key]) > -1)
        ++acc[key];
      tempData[key].push(el[key]);
      return acc
    },acc);
  },{});
  const resultArray = sortKeys(repeated);
  const length = resultArray.length;
  return [resultArray[length-1][0], resultArray[length-2][0]]; // take the highest two
}
