const getColor = (value, maxMin, colors) => {
    const {max, min} = maxMin;
    return colors[Math.floor(((value-min)/(max-min))*(colors.length -1))];
}

const generateIndexHeader = (data) => {
  if (Array.isArray(data.index_field)) {
    return data.index_field.map( (item,i) =>{
      return { Header: '', accessor: 'index'+i }
    })
  }
  else {
    return [{ Header: '', accessor: 'index0' }]
  }
}

export const generateIndexField = data => {
  const obj = {};
  if (Array.isArray(data.index_field)) {
    return data.index_field.map( (item,i) =>{
      obj[`index${i}`] = item
      return obj;
    });
  }
  else {
    return [{ index0: data.index_field }] ;
  }
}
export const generateCol = (data, maxMin, colors) => {
    const temp = {};
    const indexHeader = generateIndexHeader(data);
    return data.columns.reduce((acc, column, i) => {
        if (temp[column[0]] !== undefined) {
            const access = column.join();
            acc[temp[column[0]]].columns.push({
                Header: column[1],
                accessor: column.join(),
                getProps: (state, rowInfo, column) => {
                    return {
                        style: {
                            background: getColor(rowInfo.row[access], maxMin[i], colors)
                        }
                    };
                }
            });
        } else {
            if (column.length === 1)
                acc.push({
                    Header: column[0],
                    accessor: column[0],
                    getProps: (state, rowInfo, column) => {
                        return {
                            style: {
                                background: getColor(rowInfo.row[column[0]], maxMin[i], colors)
                            }
                        };
                    }
                });
            else {
                const access = column.join();
                acc.push({
                    Header: column[0],
                    columns: [{
                        Header: column[1],
                        accessor: column.join(),
                        getProps: (state, rowInfo, column) => {
                            return {
                                style: {
                                    background: getColor(rowInfo.row[access], maxMin[i], colors)
                                }
                            };
                        }
                    }]
                });
            }
            temp[column[0]] = acc.length - 1;
        }
        return acc
    }, indexHeader);
}
const getMaxMinVals = data => {
    return Array(data[0].length).fill({}).map((col, i) => {
      const res = data.map(cell => cell[i]);
      return {
          max: Math.max(...res),
          min: Math.min(...res)
      }
    });
}
export const generateData = data => {
  const indexField = generateIndexField(data);
  let content;
if (Array.isArray(data.index_field)) {
  content = data.data.map((el, index) => {
    if (index > 0 && (data.index[index][0]=== data.index[index-1][0])) {
      return el.reduce((acc, cell, i) => {
          const key = data.columns[i].join();
          acc[key] = cell;
          return acc;
      }, { index1: data.index[index][1] });
    }
    else {
      return el.reduce((acc, cell, i) => {
          const key = data.columns[i].join();
          acc[key] = cell;
          return acc;
      }, { index0: data.index[index][0],index1: data.index[index][1] });
    }
 });
}
else {
  content = data.data.map((el, index) => {
     return el.reduce((acc, cell, i) => {
         const key = data.columns[i].join();
         acc[key] = cell;
         return acc;
     }, { index0: data.index[index] });
 });
}
    return {
        newData: [indexField[0], ...content],
        maxMin: getMaxMinVals(data.data)


    };
}
