""" Flask API entrypoint """

from os import getenv, getcwd
import logging
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS, cross_origin
from markupsafe import escape

from spikexplorer_core.core import eeg
from spikexplorer_core import services


def setup_logger(level: int):
    """configure logger"""
    logging.basicConfig(
        filename=str(Path(getcwd()) / "flask.log"),
        filemode="a",
        format="%(asctime)s - %(levelname)s - %(message)s",
        level=level,
    )


# Start Flask #################################################################
setup_logger(logging.INFO)
load_dotenv()
app = Flask(__name__)
CORS(app)
# environmental variables
DATADIR = getenv("DATADIR")  # where user data is stored
ROOT = getenv("ROOT")  # URL endpoint e.g. server:port/ROOT
patients_cache = {}
logging.info("Starting Flask with DATADIR=%s and ROOT=%s", DATADIR, ROOT)
################################################################################


# Routes #######################################################################
@cross_origin()
@app.route(
    ROOT + "/patient/<patient_id>/eeg/<sample_id>/<start>/<num_records>/<electrodes>",
    methods=["GET"],
)
def fetch_patient_eeg(
    patient_id: str, sample_id: str, start: int, num_records: int, electrodes: str
):
    """Index patient dataset to retrieve subset of EEG data"""
    try:
        patient_id = escape(patient_id)
        sample_id = escape(sample_id)
        start_ms = int(escape(start))
        num_records = int(escape(num_records))
        electrodes = escape(electrodes)
        electrodes = [int(el) for el in electrodes.split(",")]

        patient = eeg.Patient(DATADIR, patient_id)
        key = (patient_id, sample_id)
        if key not in patients_cache:
            # read from memory if data not cached
            patients_cache[key] = eeg.load_eeg_df(patient, sample_id)

        return services.fetch_eeg_request(
            patient, patients_cache[key], start_ms, num_records, electrodes
        )
    except FileNotFoundError:
        err_msg = "Patient data not found"
        logging.error("%s: %s %s", err_msg, patient_id, sample_id)
        return {"data": None, "error": err_msg}
    # pylint: disable=broad-exception-caught
    except Exception:
        logging.error("error", exc_info=True)
        return {"data": None, "error": "internal server error?"}


@cross_origin()
@app.route(
    ROOT + "/patient/<patient_id>/similar/<sample_id>/<event_id>/<n_neigh>",
    methods=["GET"],
)
def fetch_similar_events(patient_id: str, sample_id: str, event_id: int, n_neigh: int):
    """Fetch most similar events using PCA"""
    patient_id = escape(patient_id)
    sample_id = escape(sample_id)
    event_id = escape(event_id)
    n_neigh = escape(n_neigh)

    try:
        patient = eeg.Patient(DATADIR, patient_id)
        return services.fetch_similar(patient, sample_id, event_id, n_neigh)
    # pylint: disable=broad-exception-caught
    except Exception:
        logging.error("error", exc_info=True)
        return {"data": None, "error": "internal server error?"}
