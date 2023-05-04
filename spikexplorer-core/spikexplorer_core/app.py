""" Flask API entrypoint """

from os import getenv, getcwd
import logging
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, jsonify, escape
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import BadRequest, InternalServerError

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
logging.info("Starting Flask with DATADIR=%s and ROOT=%s", DATADIR, ROOT)
################################################################################


# Error handlers ###############################################################
@app.errorhandler(InternalServerError)
def handle_internal_server_error(error):
    """Handler for cases when the code raised an exception"""
    response = {"description": error.description}
    return jsonify(response), 500


@app.errorhandler(BadRequest)
def handle_bad_request(error):
    """Handler for cases when the parameters are wrong"""
    response = {"description": error.description}
    return jsonify(response), 400


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
        start = int(start)
        num_records = int(num_records)
        electrodes = escape(electrodes)
        electrodes = [int(el) for el in electrodes.split(",")]
        patient = eeg.Patient(DATADIR, patient_id)

        return services.fetch_eeg_request(
            patient, sample_id, start, num_records, electrodes
        )
    except ValueError as exc:
        err_msg = "Wrong parameters"
        logging.error(err_msg, exc_info=True)
        raise BadRequest(err_msg) from exc
    except FileNotFoundError as exc:
        err_msg = "Patient data not found"
        logging.error("%s: %s %s", err_msg, patient_id, sample_id)
        raise BadRequest(err_msg) from exc
    # pylint: disable=broad-exception-caught
    except Exception as exc:
        logging.error("error", exc_info=True)
        raise InternalServerError("internal server error") from exc


@cross_origin()
@app.route(
    ROOT + "/patient/<patient_id>/similar/<sample_id>/<event_id>/<n_neigh>",
    methods=["GET"],
)
def fetch_similar_events(patient_id: str, sample_id: str, event_id: int, n_neigh: int):
    """Fetch most similar events using PCA"""

    try:
        n_neigh = int(n_neigh)
        event_id = int(event_id)
        patient = eeg.Patient(DATADIR, patient_id)
        return services.fetch_similar(patient, sample_id, event_id, n_neigh)
    except ValueError as exc:
        err_msg = "Wrong parameters"
        logging.error(err_msg, exc_info=True)
        raise BadRequest(err_msg) from exc
    except FileNotFoundError as exc:
        err_msg = "Patient data not found"
        logging.error("%s: %s %s", err_msg, patient_id, sample_id)
        raise BadRequest(err_msg) from exc
    # pylint: disable=broad-exception-caught
    except Exception as exc:
        logging.error("error", exc_info=True)
        raise InternalServerError("internal server error") from exc
