from flask import Flask, json, jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
from scipy import signal
import pywt

app = Flask(__name__)

CORS(app)

def fetchData(patientID, sample):
    df = pd.read_parquet('data/{}/{}/eegData.parquet'.format(patientID, sample))  
    electrodes = pd.read_csv('data/{}/{}_electrodes_new.csv'.format(patientID, patientID))
    elist = [value - 1 for value in electrodes['electrode_number'].values]
    data = df[df.index.isin(elist)]
    return data

def spikeDetectionWithBandPassFilter(patientID, sample):
    df_parquet = fetchData(patientID, sample)    
#     print(df_parquet)
    spikes = []
    for index, row in df_parquet.iterrows():
        # Convert pandas Series object to numpy array
        row = row.values

        # Define the filter parameters
        lowcut = 1  # Lower cutoff frequency
        highcut = 50  # Higher cutoff frequency
        fs = 200  # Sampling rate
        order = 4  # Filter order

        # Apply the bandpass filter
        b, a = signal.butter(order, [lowcut, highcut], btype='band', fs=fs)
        filtered_data = signal.filtfilt(b, a, row)

        # Compute the threshold value
        threshold = filtered_data.std() * 10

        # Detect the spikes
        spike_indices = signal.find_peaks(filtered_data, height=threshold)[0]
        
        spikes.append({index: list(spike_indices)})
            
    return spikes


# Iterate over each row in the data
'''approach 2: using find_peaks_cwt find peaks based on the threshold'''

def spikeDetectionUsingWaveletTransform(patientID, sample):
    df_parquet = fetchData(patientID, sample)   
#     print(df_parquet)
    spikes = []        
    fs = 200  # sampling rate, Hz
    for i in range(len(df_parquet)):

        row = df_parquet.iloc[i].values  # get a single row

        # Find peaks using find_peaks_cwt
        indexes = signal.find_peaks_cwt(row, widths=np.arange(5, 20), min_snr=4, max_distances=np.arange(5, 20))
    #                       , max_distances=np.arange(30, 85))
        
        spikes.append({i: list(indexes)})
    return spikes


def calculatePeak(v, delta, x=None):
    '''
    MATLAB script at http://billauer.co.il/peakdet.html
    reference - http://billauer.co.il/blog/2009/01/peakdet-matlab-octave/
    '''
    maxPeak = []
    minPeak = []
    
    if x is None:
        x = np.arange(len(v))
    
    v = np.asarray(v)
    
    minimum, maximum = np.Inf, -np.Inf
    minPos, maxPos = np.NaN, np.NaN
    
    lookForMax = True
    
    for i in np.arange(len(v)):
        this = v[i]
        
        if this > maximum:
            maximum = this
            maxPos = x[i]
            
        if this < minimum:
            minimum = this
            minPos = x[i]
            
        if lookForMax:
            if this < maximum - delta:
                maxPeak.append((maxPos, maximum))
                minimum = this
                minPos = x[i]
                lookForMax = False
                
        else:
            if this > minimum + delta:
                minPeak.append((minPos, minimum))
                maximum = this
                maxPos = x[i]
                lookForMax = True
                
    return np.array(maxPeak) #, np.array(minPeak)


def SpikeDetectionWithLocalMaxima(patientID, sample):
    df_parquet = fetchData(patientID, sample) 
    spikes = []
    for index, row in df_parquet.iterrows():
        # Convert pandas Series object to numpy array
        row = row.values
        
        maxtab= calculatePeak(row, 1000)
#         print(maxtab.size)
        if maxtab.size > 0:
#             print('size greater than 0')
            spikes.append({index: list(np.array(maxtab)[:,0].astype(int))})            
        else:
            spikes.append({index: []})
            
    return spikes


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
    spikeData = spikeDetectionWithBandPassFilter(new_data['patientID'], new_data['sample']) 
    
    # returning the data to the frontend
    return jsonify(spikeData)


@app.route("/wavelet", methods=['GET', 'POST'])
@cross_origin()
def spikeMethodUsingWavelet():
    frontData = request.json
    new_data = frontData['data']        
    
    # Call the function with patientID and sample
    SpikeDetectionWithLocalMaxima(new_data['patientID'], new_data['sample'])
    
    # returning the data to the frontend
    return jsonify(spikeData)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)