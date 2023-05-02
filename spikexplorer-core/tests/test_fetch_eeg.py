""" Tests for fetching data from patients EEG """
import pytest
import pandas as pd
import numpy as np
from spikexplorer_core.eeg import eeg


@pytest.fixture
def input_dataframe() -> pd.DataFrame:
    """Basic dataframe to use as input for every test"""
    num_cols = 500
    num_electrodes = 10
    elec_data = np.random.rand(num_electrodes, num_cols)
    cols = [i for i in range(num_cols)]
    return pd.DataFrame(elec_data, columns=cols)


# pylint: disable=W0621:redefined-outer-name
def test_fetch_all_data(input_dataframe: pd.DataFrame):
    """Test only filtering by electrodes"""
    start_ms = None
    num_records = None
    electrodes = [0, 1, 2]
    output_df = eeg.index_eeg(input_dataframe, electrodes, start_ms, num_records)
    assert input_dataframe.shape[1] == output_df.shape[1]
    assert len(electrodes) == output_df.shape[0]


# pylint: disable=W0621:redefined-outer-name
def test_fetch_first_n_cols_from_start(input_dataframe: pd.DataFrame):
    """Test when searching from start"""
    start_ms = None
    num_records = 100
    electrodes = [0, 1, 2]
    output_df = eeg.index_eeg(input_dataframe, electrodes, start_ms, num_records)
    assert output_df.shape[1] == num_records
    assert output_df.shape[0] == len(electrodes)


# pylint: disable=W0621:redefined-outer-name
def test_fetch_first_n_cols_from_within(input_dataframe: pd.DataFrame):
    """Test searching from a starting index"""
    start_ms = 100
    num_records = 150
    electrodes = [0, 1, 2]
    output_df = eeg.index_eeg(input_dataframe, electrodes, start_ms, num_records)
    assert output_df.shape[1] == num_records
    assert output_df.shape[0] == len(electrodes)


# pylint: disable=W0621:redefined-outer-name
def test_fetch_first_n_cols_insufficient(input_dataframe: pd.DataFrame):
    """Test searching when the requested number of records is bigger than
    the available columns"""
    start_ms = 400
    num_records = 150
    electrodes = [0, 1, 2]
    remaining = input_dataframe.shape[1] - 400

    output_df = eeg.index_eeg(input_dataframe, electrodes, start_ms, num_records)
    assert output_df.shape[1] == remaining
    assert output_df.shape[0] == len(electrodes)


# pylint: disable=W0621:redefined-outer-name
def test_transform_df_to_dict(input_dataframe: pd.DataFrame):
    """Test transforming the dataframe into an output dictionary to be used
    in the request response"""
    start_ms = 100
    num_records = 150
    electrodes = [0, 3, 5]
    output_df = eeg.index_eeg(input_dataframe, electrodes, start_ms, num_records)
    output = eeg.egg_df_to_dict(output_df)

    assert 0 in output
    assert 3 in output
    assert 5 in output
    assert len(output[0]) == 150
    assert len(output[3]) == 150
    assert len(output[5]) == 150
