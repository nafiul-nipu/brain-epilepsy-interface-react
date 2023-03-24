import numpy as np
import pandas as pd
from scipy import signal
from fetchdata import fetchData

# Iterate over each row in the data
'''approach 2: using find_peaks_cwt find peaks based on the threshold
the slowest'''

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
        
        spikes.append({i: indexes.tolist()})
    return spikes