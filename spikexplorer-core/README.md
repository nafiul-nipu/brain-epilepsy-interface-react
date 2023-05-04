# SplikeXplorer back-end

## Requirements

### Environmental variables

```
  DATADIR: path to patients parquet files
  ROOT: endpoing for deploymeny
```

## Endpoints

`/patient/<patient_id>/eeg/<sample_id>/<start>/<num_records>/<electrodes>`

- patient*id: str (e.g., \_ep128*)
- sample*id: str (e.g., \_sample1*)
- start: int starting millisecond
- num*records: int num milliseconds after \_start*
- electrodes: str electrodes of interest as concat list of ints (e.g., _1,5,10_)

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
  error: null
}
```

`/patient/<patient_id>/similar/<sample_id>/<event_id>/<n_neigh>`

- patient*id: str (e.g., \_ep128*)
- sample*id: str (e.g., \_sample1*)
- event_id: int target event
- n_neigh: int number of neighbors to return

```
// Successful payload
{
  "neighbhors": [1,22,12,32,43], // sample list of events
  "error": null
}
```
