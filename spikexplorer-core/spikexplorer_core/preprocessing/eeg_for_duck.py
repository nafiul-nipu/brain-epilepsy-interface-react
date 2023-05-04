""" Script for transforming the eegs dataframes from wide format to a 
'electrode', 'ms', 'value' format for easier querying"""

from sys import argv
from os import listdir
from argparse import Namespace, ArgumentParser
from pathlib import Path
import pandas as pd
from rich.console import Console


def parse_args(args) -> Namespace:
    """Parse args from command line"""
    # fmt: off
    parser = ArgumentParser(prog="Transform wide format to long for duckdb")
    parser.add_argument("datadir", type=str, help="patient data dir")
    parsed_args = parser.parse_args(args)
    # fmt: on
    return parsed_args


def main():
    """Transform dataframes in directory and save"""
    console = Console()
    with console.status("[bold green] transforming data..."):
        args = parse_args(argv[1:])
        patients_path = Path(args.datadir) / "patients"

        patients = [
            patients_path / el
            for el in listdir(patients_path)
            if (patients_path / el).is_dir() and el.startswith("ep")
        ]

        for patient in patients:
            console.log(f"processing patient {patient.stem}")
            samples = [
                patient / el
                for el in listdir(patient)
                if (patient / el).is_dir() and el.startswith("sample")
            ]
            for sample in samples:
                df_path = sample / "eegData_fast.parquet"
                data = pd.read_parquet(df_path, engine="pyarrow")
                data = data.reset_index()
                data = data.melt(id_vars=["index"], var_name="ms", value_name="value")
                data = data.rename(columns={"index": "electrode"})
                data["ms"] = data["ms"].astype("int64")
                data.to_parquet(sample / "eegdb.parquet", engine="pyarrow")


if __name__ == "__main__":
    main()
