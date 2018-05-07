export const generateCol = data =>{
  const keys = Object.keys(data);
  return keys.map(key => {
    if(Array.isArray(data[key]))
      return {
        Header: key,
        accessor: key,
        id: key
      };
    else
      return {
        Header: key,
        columns: generateCol(data[key])
      }
  });
}
const getRow = (data, i) =>{
  const keys = Object.keys(data);
  let acc ={};
  keys.every(key => {
    if(Array.isArray(data[key])){
      if(i < data[key].length)
        acc[key] = data[key][i];
      else return acc = undefined
    }else{
      const newKey = getRow(data[key], i)
      if (!newKey) return acc = newKey;
      acc = {...acc,...newKey};
    }
    return true;
  });
  return acc;
}
export const generateData = data =>{
  const result = [];
  let i = 0;
  let row = getRow(data,i++);
  while(row){
    result.push(row);
    row = getRow(data,i++);
  }
  return result
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
