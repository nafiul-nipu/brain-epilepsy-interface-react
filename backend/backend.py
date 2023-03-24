from flask import Flask, json, jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np

from peakFinder import  SpikeDetectionWithLocalMaxima
from wavelet import spikeDetectionUsingWaveletTransform
from bandPassFilter import spikeDetectionWithBandPassFilter

app = Flask(__name__)

CORS(app)


@app.route("/filter", methods=['GET', 'POST'])
@cross_origin()
def spikeMethodUsingFilter():
    frontData = request.json
    # print(frontData)
    new_data = frontData['data']  
    # print(new_data['patientID'], new_data['sample'])      
    
    # Call the function with patientID and sample
    spikeData = spikeDetectionWithBandPassFilter(new_data['patientID'], new_data['sample']) 
    
    # returning the data to the frontend
    return jsonify(spikeData)


@app.route("/peak", methods=['GET', 'POST'])
@cross_origin()
def spikeMethodUsingPeak():
    frontData = request.json
    new_data = frontData['data']        
    
    # Call the function with patientID and sample
    spikeData = SpikeDetectionWithLocalMaxima(new_data['patientID'], new_data['sample']) 
    
    # returning the data to the frontend
    return jsonify(spikeData)


@app.route("/wavelet", methods=['GET', 'POST'])
@cross_origin()
def spikeMethodUsingWavelet():
    frontData = request.json
    new_data = frontData['data']        
    
    # Call the function with patientID and sample
    spikeData = spikeDetectionUsingWaveletTransform(new_data['patientID'], new_data['sample'])
    
    # returning the data to the frontend
    return jsonify(spikeData)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)