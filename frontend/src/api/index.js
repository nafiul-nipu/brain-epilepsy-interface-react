import { run } from "./client";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const emptyRequestData = {
  data: undefined,
  token: undefined,
  params: undefined,
};

export const fetchEEGperPatient = async (
  patientId,
  sampleId,
  startMs,
  numRecords,
  electrodes // List of int
) => {
  const strElectrodes = electrodes.join(",");
  const url = `${API_ENDPOINT}/patient/${patientId}/eeg/${sampleId}/${startMs}/${numRecords}/${strElectrodes}`;

  try {
    const { eeg, peaks } = await run(url, "get", emptyRequestData);
    return { data: { eeg, peaks }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchSimilarRegions = async (
  patientId,
  sampleId,
  eventId,
  numNeighbors
) => {
  const url = `http://127.0.0.1:5000//patient/${patientId}/similar/${sampleId}/${eventId}/${numNeighbors}`;
  try {
    const { data } = await run(url, "get", emptyRequestData);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
