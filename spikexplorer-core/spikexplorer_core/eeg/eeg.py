""" Module for handling the EEG requests """
from dataclasses import dataclass, field
from typing import Optional, List, Dict
from pathlib import Path
import json
import pandas as pd


@dataclass
class Patient:
    """Placeholder for location of patient info on disk
    Arguments:
    - datadir:    str   Location on disk for project data
    - patient_id: str   id in format epNUMBER, e.g., ep1
    """

    datadir: str
    patient_id: str
    patient_path: Path = field(init=False)

    def __post_init__(self):
        self.patient_path = Path(self.datadir) / "patients" / self.patient_id

    def eeg_path(self, sample_id: str):
        """Location of parquet file with eeg data"""
        return self.patient_path / sample_id / "eegData_fast.parquet"

    def events_path(self, sample_id: str):
        """Location of events for sample"""
        return self.patient_path / sample_id / f"{sample_id}_events.json"

    def sorted_data(self, sample_id: str):
        """TODO: this needs a better name, there are events and network data here"""
        return self.patient_path / sample_id / f"{self.patient_id}_sorted_data.json"

    def fetch_electrodes(self) -> List[int]:
        """List of electrode numbers"""
        f_path = Path(self.datadir) / "patients" / self.patient_id
        f_path = f_path / f"{self.patient_id}_electrodes_new.csv"
        df_electrodes = pd.read_csv(f_path)
        return df_electrodes["electrode_number"].tolist()


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
