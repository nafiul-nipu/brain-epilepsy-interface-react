import pandas as pd

def fetchData(patientID, sample):
    df = pd.read_parquet('data/{}/{}/eegData.parquet'.format(patientID, sample))  
    electrodes = pd.read_csv('data/{}/{}_electrodes_new.csv'.format(patientID, patientID))
    elist = [value - 1 for value in electrodes['electrode_number'].values]
    data = df[df.index.isin(elist)]
    return data