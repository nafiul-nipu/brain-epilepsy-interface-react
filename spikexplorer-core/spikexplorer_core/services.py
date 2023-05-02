""" Module that integrates the logic for the Flask routes """
from typing import Optional, List
from pandas import DataFrame

from spikexplorer_core.eeg import eeg


def fetch_eeg_request(
    patient: eeg.PatientRequest,
    input_eeg_df: DataFrame,
    start_ms: Optional[int],
    num_records: int,
    electrodes: List[int],
):
    """Service for fetching the patient EEG data and peaks at time period"""
    start_ms = None if start_ms == -1 else start_ms

    print(electrodes)
    print(start_ms)
    print(num_records)
    print(input_eeg_df.head())
    filtered_eeg_df = eeg.index_eeg(input_eeg_df, electrodes, start_ms, num_records)
    eeg_dict = eeg.egg_df_to_dict(filtered_eeg_df)
    peaks = eeg.fetch_spike_times_by_electrodes(
        patient, electrodes, start_ms, num_records
    )

    return {"eeg": eeg_dict, "peaks": peaks}
