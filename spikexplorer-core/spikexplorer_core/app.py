""" Flask API entrypoint """

import logging
from os import getenv
from flask import Flask
from flask_cors import CORS, cross_origin
from markupsafe import escape

from spikexplorer_core.eeg import eeg

app = Flask(__name__)
CORS(app)

# environmental variables
DATADIR = getenv("DATADIR")  # where user data is stored
ROOT = getenv("ROOT")  # URL endpoint e.g. server:port/ROOT

patients_egg = {}


@cross_origin()
@app.route(ROOT + "/hello")
def hello():
    """just to check if server is up"""
    return "Hello world!"


@cross_origin()
@app.route(ROOT + "/patient/<patient_id>/<sample_id>/<start>/<end>", methods=["GET"])
def fetch_patient_eeg(patient_id: str, sample_id: str, start: int, end: int):
    """Index patient dataset to retrieve subset of EEG data"""
    try:
        patient_id = escape(patient_id)
        sample_id = escape(sample_id)
        start_ms = int(escape(start))
        end_ms = int(escape(end))

        key = (patient_id, sample_id)
        if key not in patients_egg:
            # read from memory if data not cached
            patients_egg[key] = eeg.load_eeg_df(DATADIR, patient_id, sample_id)
        start_ms = None if start_ms == -1 else start_ms
        end_ms = None if end_ms == -1 else end_ms
        patient_df = eeg.index_eeg(patients_egg[key], start_ms, end_ms)
        return {"data": patient_df.to_json(orient="values"), "error": None}
    except FileNotFoundError:
        err_msg = "Patient data not found"
        logging.error("%s: %s %s", err_msg, patient_id, sample_id)
        return {"data": None, "error": err_msg}
    # pylint: disable=bare-except
    except:
        logging.error("TODO")
        return {"data": None, "error": "internal server error?"}
