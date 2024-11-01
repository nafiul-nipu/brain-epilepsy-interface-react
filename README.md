# SpikeXplorer

## Requirements

### add .env files

#### Frontend

Go to frontend and create an .env file and add

```
// .env
REACT_APP_API_ENDPOINT=//flask api endpoint (e.g., http://localhost:5000)
```

#### Backend

Go to spikexplorer-core and create an .env file and add

```
  DATADIR: path to patients parquet files
  (e.g., User/Document/DATADIR)
  ROOT: endpoint for deployment
  (e.g., ROOT='')
```
