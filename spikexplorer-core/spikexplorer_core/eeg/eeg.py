""" Module for handling the EEG requests """
from typing import Optional
from pathlib import Path
import pandas as pd


def load_eeg_df(datadir: str, patient_id: str, sample_id: str) -> pd.DataFrame:
    """Load and return EEG dataframe to store it on app server memory
    Arguments:
    - datadir:    str   Location on disk for project data
    - patient_id: str   id in format epNUMBER, e.g., ep1
    - sample_id:  str   sample id in format sample_NUMBER, e.g. sample_10
    Returns:
      Dataframe
    Raises:
      FileNotFound exception
    """
    filepath = Path(datadir) / "patients" / patient_id / sample_id / "eegData.parquet"
    return pd.read_parquet(filepath)


def index_eeg(
    patient_df: pd.DataFrame, start_ms: Optional[int], end_ms: Optional[int]
) -> pd.DataFrame:
    """Index in memory dataframe to return subset of EEG data"""
    if not start_ms:
        start_ms = 0
    if not end_ms:
        end_ms = patient_df.shape[1]
    return patient_df[start_ms:end_ms]
