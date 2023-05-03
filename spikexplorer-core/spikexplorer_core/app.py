""" Flask API entrypoint """

import logging
from dotenv import load_dotenv
from os import getenv
from flask import Flask
from flask_cors import CORS, cross_origin
from markupsafe import escape

from spikexplorer_core.eeg import eeg
from spikexplorer_core import services

load_dotenv()
app = Flask(__name__)
CORS(app)

# environmental variables
DATADIR = getenv("DATADIR")  # where user data is stored
ROOT = getenv("ROOT")  # URL endpoint e.g. server:port/ROOT

print("params")
print(DATADIR)
print(ROOT)

patients_egg = {}


@cross_origin()
@app.route(ROOT + "/hello")
def hello():
    """just to check if server is up"""
    return "Hello world!"


@cross_origin()
@app.route(
    ROOT + "/patient/<patient_id>/<sample_id>/<start>/<num_records>/<electrodes>",
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
        if key not in patients_egg:
            # read from memory if data not cached
            patients_egg[key] = eeg.load_eeg_df(patient, sample_id)

        return services.fetch_eeg_request(
            patient, patients_egg[key], start_ms, num_records, electrodes
        )
    except FileNotFoundError:
        err_msg = "Patient data not found"
        logging.error("%s: %s %s", err_msg, patient_id, sample_id)
        return {"data": None, "error": err_msg}
    # pylint: disable=bare-except
    except Exception as e:
        logging.error("error", exc_info=True)
        print(e)
        return {"data": None, "error": "internal server error?"}
