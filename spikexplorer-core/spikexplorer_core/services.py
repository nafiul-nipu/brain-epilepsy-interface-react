""" Module that integrates the logic for the Flask routes """
from typing import Optional, List
from pandas import DataFrame

from spikexplorer_core.eeg import eeg


def fetch_eeg_request(
    patient: eeg.Patient,
    sample_id: str,
    input_eeg_df: DataFrame,
    start_ms: Optional[int],
    num_records: int,
    electrodes: List[int],
):
    """Service for fetching the patient EEG data and peaks at time period"""
    start_ms = None if start_ms == -1 else start_ms

    filters = {
        "electrodes": electrodes,
        "start_ms": start_ms,
        "num_records": num_records,
    }
    filtered_eeg_df = eeg.index_eeg(input_eeg_df, **filters)
    eeg_dict = eeg.egg_df_to_dict(filtered_eeg_df)
    peaks = eeg.fetch_spike_times_by_electrodes(patient, sample_id, **filters)

    return {"eeg": eeg_dict, "peaks": peaks}
