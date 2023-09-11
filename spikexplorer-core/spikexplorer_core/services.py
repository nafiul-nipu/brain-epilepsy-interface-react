""" Module that integrates the logic for the Flask routes """
from typing import Optional, List
from pandas import DataFrame

from spikexplorer_core.core import eeg, similarity
from spikexplorer_core.core.patient import Patient


def fetch_eeg_request(
    patient: Patient,
    sample_id: str,
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
    eeg_dict = eeg.fetch_eeg_data_from_db(patient, sample_id, **filters)
    peaks = eeg.fetch_spike_times_by_electrodes(patient, sample_id, **filters)

    return {"eeg": eeg_dict, "peaks": peaks}


def fetch_similar(patient: Patient, sample_id: str, event_id: int,similar_check: str, n_neighbors: int, ):
    """Return n_neighbors most similar graphs based on all nodes, PCA and KNN"""
    event_ids = similarity.find_similar_pca(
        patient, sample_id, event_id, similar_check, n_neighbors=n_neighbors
    )
    return {"neighbhors": event_ids}
