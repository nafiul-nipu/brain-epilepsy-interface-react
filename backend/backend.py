from flask import Flask, json, jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np

from peakFinder import  SpikeDetectionWithLocalMaxima
from wavelet import spikeDetectionUsingWaveletTransform
from bandPassFilter import spikeDetectionWithBandPassFilter

app = Flask(__name__)

CORS(app)

# WHATEVER_API/patient/<id_patient>/peaks/<method>/<sample>

@app.route("/filter", methods=['GET'])
@cross_origin()
def spike_with_band_pass_filter():
    patientID = request.args.get('id')
    sample = request.args.get('sample')    
    
    # Call the function with patientID and sample
    spikeData = spikeDetectionWithBandPassFilter(patientID, sample) 
    
    # returning the data to the frontend
    return jsonify(spikeData)


@app.route("/peak", methods=['GET'])
@cross_origin()
def spike_with_wavelet():
    patientID = request.args.get('id')
    sample = request.args.get('sample')          
    
    # Call the function with patientID and sample
    spikeData = SpikeDetectionWithLocalMaxima(patientID, sample) 
    
    # returning the data to the frontend
    return jsonify(spikeData)


@app.route("/wavelet", methods=['GET'])
@cross_origin()
def spike_with_local_maxima():
    patientID = request.args.get('id')
    sample = request.args.get('sample')         
    
    # Call the function with patientID and sample
    spikeData = spikeDetectionUsingWaveletTransform(patientID, sample)
    
    # returning the data to the frontend
    return jsonify(spikeData)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)