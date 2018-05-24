const getStyle = (data, value,access,taj) => {
    const { useForegroundColors,useBackgroundColors } = taj.props;
    if (data.meta.columns.bins && data.meta.columns.bins[access] && value) {
        let newStyle = { background: '',color: '' };
        const { colors } = data.meta.columns.bins[access];
        data.meta.columns.bins[access].edges.every((edge, i) => {
            if (value >= edge && colors.bg[i]) {
                const background = useBackgroundColors? (colors.bg[i]):'';
                const color = useForegroundColors? (colors.fg[i]):'';
                newStyle = { background:background,color:color };

                return true;
            }

            return false;
        });

        return newStyle;
    }

    const { bg,fg } = data.meta.colors; // default colors
    const background = useBackgroundColors? bg:'';
    const color = useForegroundColors? fg:'';

    return {
        background: background,
        color: color
    };
};

const generateIndexHeader = data => {
    if (Array.isArray(data.meta.index.name)) // if super
        return data.meta.index.name.map(name => ({
            Header: '', // change this to name to add index header to the first row
            accessor: name,
            id: name,
            getProps: (state, rowInfo, column,taj) => {
                return {
                    style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                };
            }
        }));

    return [{
        Header: '',
        accessor: 'index0',
        getProps: (state, rowInfo, column,taj) => {
            return {
                style: getStyle(data,rowInfo.row[column.id],column.id,taj)
            };
        }
    }];
};

export const generateIndexField = data => {
    const obj = {};
    if (Array.isArray(data.meta.index.name)) // if super
        return data.meta.index.name.map(item => {
            obj[item] = item;

            return obj;
        });

    return [{ index0: data.meta.index.name }];
};
export const generateCol = data => {

    const temp = {};
    const indexHeader = generateIndexHeader(data);
    if (Array.isArray(data.columns[0])) // not simple json
        return data.columns.reduce((acc, column) => {
            if (temp[column[0]] !== undefined)
                acc[temp[column[0]]].columns.push({
                    Header: column[1],
                    accessor: column.join('|'),
                    getProps: (state, rowInfo, column,taj) => {
                        return {
                            style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                        };
                    }
                });
            else {
                if (column.length === 1)
                    acc.push({
                        Header: column[0],
                        accessor: column[0],
                        getProps: (state, rowInfo, column,taj) => {
                            return {
                                style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                            };
                        }
                    });
                else
                    acc.push({
                        Header: column[0],
                        columns: [{
                            Header: column[1],
                            accessor: column.join('|'),
                            getProps: (state, rowInfo, column,taj) => {
                                return {
                                    style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                                };
                            }
                        }]
                    });
                temp[column[0]] = acc.length - 1;
            }

            return acc;
        }, indexHeader);
    // if table is simple
    const newCols = data.columns.map(column => {
        return {
            Header: column,
            accessor: column,
            id: column,
            getProps: (state, rowInfo, column,taj) => {
                return {
                    style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                };
            }
        };
    });

    return [
        {
            Header: 'Index',
            accessor: 'index0',
            id: 'index0',
            getProps: (state, rowInfo, column,taj) => {
                return {
                    style: getStyle(data,rowInfo.row[column.id],column.id,taj)
                };
            }
        },
        ...newCols
    ];
};
export const generateData = data => {
    let indexCols;
    const content = data.data.map((el, index) => {
        if (Array.isArray(data.meta.index.name)) // if super
            indexCols = data.meta.index.name.reduce((acc, indexName, i) => {
                acc[indexName] = data.index[index][i];

                return acc;
            },{});
        else
            indexCols = { index0: data.index[index] };

        return el.reduce((acc, cell, i) => {
            if (Array.isArray(data.columns[i])) // not simple json
                acc[data.columns[i].join('|')] = cell;
            else
                acc[data.columns[i]] = cell;

            return acc;
        }, indexCols);
    });
    if (!data.meta.index.name)// simple
        return content;
    const indexField = generateIndexField(data); // index header row

    return [indexField[0], ...content];
};
