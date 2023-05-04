""" Module for handling the EEG requests """
from typing import Optional, List, Dict
import json
import pandas as pd
from spikexplorer_core.core.patient import Patient


def load_eeg_df(patient: Patient, sample_id: str) -> pd.DataFrame:
    """Load and return EEG dataframe to store it on app server memory
    Returns:
      Dataframe
    Raises:
      FileNotFound exception
    """
    patient_df = pd.read_parquet(patient.eeg_path(sample_id), engine="pyarrow")
    return patient_df


def index_eeg(
    patient_df: pd.DataFrame,
    electrodes: List[int],
    start_ms: Optional[int],
    num_records: Optional[int],
) -> Dict[int, List[float]]:
    """Index in memory dataframe to return subset of EEG data"""
    if not start_ms and not num_records:
        return patient_df.loc[patient_df.index.isin(electrodes), :]
    if not start_ms:
        start_ms = 0
    return patient_df.iloc[
        patient_df.index.isin(electrodes), start_ms : start_ms + num_records
    ]


def egg_df_to_dict(input_df: pd.DataFrame) -> Dict[int, List[float]]:
    """Transform dataframe into a dictionary to be sent in JSON response"""
    output = {}
    for idx, row in input_df.iterrows():
        output[idx] = row.values.tolist()
    return output


def fetch_spike_times_by_events(patient: Patient, event_ids: List[int]):
    """Fetch events with peaks"""
    with open(patient.events_path, "r", encoding="utf-8") as f_in:
        all_events = json.load(f_in)
    return {el["index"]: el for el in all_events if el["index"] in event_ids}


def fetch_spike_times_by_electrodes(
    patient: Patient,
    sample_id: str,
    electrodes: List[int],
    start_ms: int,
    num_records: int,
):
    """Fetch events with peaks"""
    with open(patient.events_path(sample_id), "r", encoding="utf-8") as f_in:
        all_events = json.load(f_in)
    inputs = []
    end_ms = start_ms + num_records
    for event in all_events:
        for idx in range(len(event["time"])):
            inputs.append([event["index"], event["electrode"][idx], event["time"][idx]])
    temp_df = pd.DataFrame(inputs, columns=["event", "electrode", "time"])
    temp_df = temp_df.loc[
        (
            (temp_df.electrode.isin(electrodes))
            & (temp_df.time >= start_ms)
            & (temp_df.time <= end_ms)
        )
    ]

    peaks = {}
    for idx, row in temp_df.iterrows():
        if row.electrode not in peaks:
            peaks[row.electrode] = []
        peaks[row.electrode].append({"time": row.time, "event": row.event})
    return peaks
