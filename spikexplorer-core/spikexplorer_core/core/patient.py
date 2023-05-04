""" Dataclass for matching patient information to stored files """

from dataclasses import dataclass, field
from pathlib import Path
from typing import List
from pandas import read_csv


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
        df_electrodes = read_csv(f_path)
        return df_electrodes["electrode_number"].tolist()

    def egg_duckdb_path(self, sample_id) -> str:
        """EEG data for duckdb"""
        return str(self.patient_path / sample_id / "eegdb.parquet")
