from flask import Flask
from flask import Response
from flask_cors import CORS

import json
from os import path
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

here = path.abspath(path.dirname(__file__))
print(here)

data_path = path.join(here, 'data', 'iris.csv')

iris = pd.read_csv(data_path)

# mpg_path = path.join(here, 'data', 'mpg.csv')
# mpg = pd.read_csv(mpg_path)

db_path = path.join(here, 'data', 'db.json')

with open(db_path) as f:
    db_json = json.loads(f.read())


def df_to_json(df):
    content = json.loads(df.to_json(orient='table'))
    content['data'] = json.loads(df.to_json(orient='columns'))
    content['tableType'] = 'Simple'
    return json.dumps(content)


def multidf_to_json(df):
    content = json.loads(df.to_json(orient='split'))
    content['index_field'] = df.index.name
    content['tableType'] = 'MultiIndex'
    return json.dumps(content)


@app.route("/original")
def original():
    global db_json
    response = Response(
        response=json.dumps(db_json),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/iris")
def iris_view():
    global iris

    response = Response(
        response=df_to_json(iris),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/mpg")
def mpg_view():
    global mpg

    response = Response(
        response=df_to_json(mpg),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/dfmulti")
def dfmulti():

    global iris
    gdf = iris.groupby('species').agg(['min', 'max','mean'])

    response = Response(
        response=multidf_to_json(gdf),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route("/dfmulti2")
def dfmulti2():

    global iris
    iris['location'] = np.random.choice(['north', 'south'], iris.shape[0])
    gdf = iris.groupby(['species', 'location']).agg(['min', 'max'])

    response = Response(
        response=multidf_to_json(gdf),
        status=200,
        mimetype='application/json'
    )
    return response


if __name__ == '__main__':
    app.run(threaded=True, debug=True)
