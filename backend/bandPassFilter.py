import pandas as pd
from scipy import signal
from fetchdata import fetchData

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
        
        spikes.append({index: spike_indices.tolist()})
            
    return spikes