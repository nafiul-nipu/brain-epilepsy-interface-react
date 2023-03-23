from flask import Flask, json, jsonify, request
from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app)

@app.route("/backend", methods=['GET', 'POST'])
@cross_origin()
def backend():
    frontData = request.json
    new_data = frontData['data']         
    
    # returning the data to the frontend
    return jsonify()


if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)