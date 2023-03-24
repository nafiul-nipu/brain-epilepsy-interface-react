import numpy as np
import pandas as pd
from fetchdata import fetchData

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
            spikes.append({index: np.array(maxtab)[:,0].astype(int).tolist()})            
        else:
            spikes.append({index: []})
            
    return spikes

