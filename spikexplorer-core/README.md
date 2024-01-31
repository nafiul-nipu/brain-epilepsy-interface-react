# SplikeXplorer back-end

## Requirements

### Environmental variables

```
  DATADIR: path to patients parquet files
  ROOT: endpoing for deploymeny
```

### Data

`DATADIR` stores the patient data in the following structure

```
DATADIR/
  patients/
    epXX/
      sample1/
        eegData_fast.parquet
        epXX_sorter_data.json
        sample1_events.json
      sample2
      epXX_electrodes_new.csv
    epXY
```

## Endpoints

On success, return 200 and payload. In case of errors, raise a 400 BadRequest or
a 500 Internal Server Error.

`/patient/<patient_id>/eeg/<sample_id>/<start>/<num_records>`

- patient*id: str (e.g., \_ep128*)
- sample*id: str (e.g., \_sample1*)
- start: int starting millisecond
- num*records: int num milliseconds after \_start*

```
// Successful payload
{
  "eeg": {
    1: [//array of float],
    2: [//array of float],
  },
  "spikes: [
    {"time": 123, "event": 1},
    {"time": 130, "event": 2},
  ],
}
```

`/patient/<patient_id>/similar/<sample_id>/<event_id>/<similar_check>/<n_neigh>`

- patient*id: str (e.g., \_ep128*)
- sample*id: str (e.g., \_sample1*)
- event_id: int target event
- similar_check: str (e.g., which roi to check for similarity or all)
- n_neigh: int number of neighbors to return

```
// Successful payload
{
  "neighbhors": [1,22,12,32,43], // sample list of events
}
```

#### Backend

##### Poetry

Poetry

1. check if the python version is >=3.9
2. check if you have curl installed
3. go to the backend folder
4. run
   poetry install
5. first time only
   poetry run python spikexplorer_core/preprocessing/eeg_for_duck.py DATADIR(local data directory)
   this transforms the the eeg data to standard duck db type data
6. set FLASK_APP=spikexplorer_core/app.py
7. poetry run flask run

real python
linters

#### python venv

1. Go to spikeexplorer-core folder
2. Create a virtual environment
   `python -m venv venv`
3. Activate the virtual environment
   `.\venv\Scripts\activate`

   For Mac
   `source venv/bin/activate`
4. Install dependencies from requirements.txt
   `pip install -r requirements.txt`
5. create a .env file with the following variables
   `DATADIR=local path to data directory`
   `ROOT=endpoint for deployment`
6. go to spikexplorer-core folder and
   set up flask app
   `set FLASK_APP=app.py`

   for mac
   `export FLASK_APP=app.py`
7. run flask
   `flask run`

8. if new dependencies are added, update requirements.txt
   `pip freeze > requirements.txt`
