""" Peaks detection module """

from pathlib import Path
from typing import List
import pandas as pd
import numpy as np
from scipy import signal

def fetch_patient_eegs(data_folder: str, patient_id: str, sample_id: str) -> pd.DataFrame:
    """ Fetch patient's eeg data from disk for active electrodes 
        Possible exception: file not found
        return dataframe with each row as electrode as each column as timestamp
    """
    eeg_path = Path(data_folder) / patient_id / sample_id / "eegData.parquet"
    elec_path = Path(data_folder) / patient_id / f"{patient_id}_electrodes_new.csv"
    df_eeg = pd.read_parquet(eeg_path)
    df_electrodes = pd.read_csv(elec_path)

    # eletrode ids in dataframe are in the index, hence the -1
    active_electrodes = [value - 1 for value in df_electrodes['electrode_number'].values]
    return df_eeg.loc[df_eeg.index.isin(active_electrodes)]


def find_peaks_band_pass_filter(
    df_eeg: pd.DataFrame,
    low_cut: int = 1,
    high_cut: int = 50,
    sampling_rate: int = 200,
    order: int = 4,
    threshold_multiplier: int = 10
  ) -> List[int]:
    """ Filter eegs using a band pass filter """
    spikes = []
    # TODO: not a fan of iterrows, this could be do with df.apply, but 
    # the function is fast so i don't care that much
    for index, row in df_eeg.iterrows():
        row = row.values

        b, a = signal.butter(order, [low_cut, high_cut], btype='band', fs=sampling_rate)
        filtered_data = signal.filtfilt(b, a, row)
        threshold = filtered_data.std() * threshold_multiplier

        spike_indices = signal.find_peaks(filtered_data, height=threshold)[0]
        spikes.append({index: spike_indices.tolist()})

    return spikes

def find_peaks_wavelet(
        df_eeg: pd.DataFrame,
        min_width: int = 5,
        max_width: int = 20,
        min_snr: int = 4,
        min_d: int = 5,
        max_d: int = 20
  ) -> List[int]:
    """ Find peaks using wavelets """
    spikes = []
    for i in range(len(df_eeg)):
        row = df_eeg.iloc[i].values
        # Find peaks using find_peaks_cwt
        indexes = signal.find_peaks_cwt(
            row,
            widths=np.arange(min_width, max_width),
            min_snr=min_snr,
            max_distances=np.arange(min_d, max_d)
        )
        spikes.append({i: indexes.tolist()})
    return spikes
